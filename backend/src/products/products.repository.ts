import {
  ConflictException,
  Injectable,
  InternalServerErrorException,
  Logger,
  OnModuleInit,
} from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { InjectConnection } from '@nestjs/mongoose';
import { Collection, Filter, MongoServerError } from 'mongodb';
import { Connection } from 'mongoose';
import { CreateProductDto } from './dto/create-product.dto';

export type ProductDocument = Record<string, unknown>;

const MONGO_DUPLICATE_KEY = 11000;

function escapeRegex(text: string): string {
  return text.replace(/[-[\]{}()*+?.,\\^$|#\s]/g, '\\$&');
}

@Injectable()
export class ProductsRepository implements OnModuleInit {
  private readonly collection: Collection<ProductDocument>;
  private readonly logger = new Logger(ProductsRepository.name);

  constructor(
    @InjectConnection() private readonly connection: Connection,
    configService: ConfigService,
  ) {
    const collectionName = configService
      .get<string>('MONGODB_COLLECTION')
      ?.trim();

    if (!collectionName) {
      throw new Error(
        'Missing required environment variable: MONGODB_COLLECTION',
      );
    }

    this.collection = connection.collection(collectionName);
  }

  async onModuleInit(): Promise<void> {
    await this.ensureIndexes();
  }

  // ─── Read ────────────────────────────────────────────────────────────────

  async findPage(
    skip: number,
    limit: number,
    filters: { category?: string; brand?: string } = {},
  ): Promise<{ items: ProductDocument[]; total: number }> {
    const query = this.buildFilterQuery(filters);

    let [items, total] = await Promise.all([
      this.collection.find(query).skip(skip).limit(limit).toArray(),
      this.collection.countDocuments(query),
    ]);

    // If configured collection has 1 or fewer items, also query the main products collection
    if (total <= 1 && this.connection.db && this.collection.collectionName !== 'products') {
      try {
        const mainCol = this.connection.db.collection<ProductDocument>('products');
        const [mainItems, mainTotal] = await Promise.all([
          mainCol.find(query).skip(skip).limit(limit).toArray(),
          mainCol.countDocuments(query),
        ]);
        if (mainTotal > 0) {
          items = mainItems;
          total = mainTotal;
        }
      } catch {
        // Fallback silently to initial items
      }
    }

    return { items, total };
  }

  async findByProductId(productId: string): Promise<ProductDocument | null> {
    const document = await this.collection.findOne({ productId });
    if (document) return document;

    // Fallback: check products and pads
    try {
      const db = this.connection.db;
      if (db) {
        for (const colName of ['products', 'pads']) {
          if (colName !== this.collection.collectionName) {
            const found = await db.collection<ProductDocument>(colName).findOne({ productId });
            if (found) return found;
          }
        }
      }
    } catch {
      // Continue
    }

    return null;
  }

  async findByNameOrKeyword(nameOrKeyword: string): Promise<ProductDocument | null> {
    if (!nameOrKeyword || typeof nameOrKeyword !== 'string' || nameOrKeyword.trim().length < 2) {
      return null;
    }
    const clean = nameOrKeyword.trim();
    const words = clean.split(/\s+/).filter((w) => w.length > 2);
    const escaped = clean.replace(/[.*+?^${}()|[\]\\]/g, '\\$&');
    const exactRegex = new RegExp(escaped, 'i');

    const db = this.connection.db;
    const collectionsToSearch = ['products', 'food_database', 'pads'];

    for (const colName of collectionsToSearch) {
      try {
        const col = db ? db.collection<ProductDocument>(colName) : this.collection;
        // 1. Direct regex match on name or brand
        let found = await col.findOne({
          $or: [
            { name: exactRegex },
            { brand: exactRegex },
          ],
        });
        if (found) return found;

        // 2. Keyword match if multiple words
        if (words.length > 1) {
          const keywordRegexes = words.map(
            (w) => new RegExp(w.replace(/[.*+?^${}()|[\]\\]/g, '\\$&'), 'i'),
          );
          found = await col.findOne({
            $and: keywordRegexes.map((r) => ({
              $or: [{ name: r }, { brand: r }, { subCategory: r }],
            })),
          });
          if (found) return found;
        }
      } catch (err: unknown) {
        this.logger.warn(`findByNameOrKeyword error in ${colName}: ${(err as Error).message}`);
      }
    }
    return null;
  }

  async findByBarcode(barcode: string): Promise<ProductDocument | null> {
    const document = await this.collection.findOne({
      $or: [{ barcode }, { productId: barcode }],
    });
    if (document) {
      return document;
    }

    // Fallback: check other collections in the database (products, food_database, pads)
    try {
      const db = this.connection.db;
      if (db) {
        const otherCollections = ['products', 'food_database', 'pads'].filter(
          (name) => name !== this.collection.collectionName,
        );
        for (const colName of otherCollections) {
          const col = db.collection<ProductDocument>(colName);
          const found = await col.findOne({
            $or: [{ barcode }, { productId: barcode }],
          });
          if (found) {
            return found;
          }
        }
      }
    } catch (err: unknown) {
      this.logger.warn(
        `Fallback collection search failed: ${(err as Error).message}`,
      );
    }

    return null;
  }

  // ─── Write ───────────────────────────────────────────────────────────────

  async create(dto: CreateProductDto): Promise<ProductDocument> {
    const now = new Date();

    // Normalise barcode: trim whitespace; undefined if empty/absent.
    const barcode =
      dto.barcode != null && dto.barcode.trim() !== ''
        ? dto.barcode.trim()
        : undefined;

    // Check for existing duplicates explicitly before insert
    const existingByProductId = await this.findByProductId(dto.productId);
    if (existingByProductId) {
      throw new ConflictException(
        `A product with productId "${dto.productId}" already exists`,
      );
    }

    if (barcode) {
      const existingByBarcode = await this.findByBarcode(barcode);
      if (existingByBarcode) {
        throw new ConflictException(
          `A product with barcode "${barcode}" already exists`,
        );
      }
    }

    const document: Record<string, unknown> = {
      productId: dto.productId,
      name: dto.name,
      brand: dto.brand,
      category: dto.category,
      ...(dto.subCategory != null && { subCategory: dto.subCategory }),
      ...(barcode != null && { barcode }),
      ...(dto.ingredientsText != null && {
        ingredientsText: dto.ingredientsText,
      }),
      ...(dto.priceINR != null && { priceINR: dto.priceINR }),
      ...(dto.servingSizeG != null && { servingSizeG: dto.servingSizeG }),
      ...(dto.nutrition != null && { nutrition: dto.nutrition }),
      createdAt: now,
      updatedAt: now,
    };

    try {
      const result = await this.collection.insertOne(document);
      return { ...document, _id: result.insertedId };
    } catch (err: unknown) {
      if (err instanceof MongoServerError && err.code === MONGO_DUPLICATE_KEY) {
        const keyPattern = err.keyPattern as
          Record<string, unknown> | undefined;
        const field =
          keyPattern && 'barcode' in keyPattern ? 'barcode' : 'productId';
        throw new ConflictException(
          `A product with this ${field} already exists`,
        );
      }
      this.logger.error(
        'Unexpected error inserting product',
        (err as Error).stack,
      );
      throw new InternalServerErrorException('Failed to create product');
    }
  }

  // ─── Index management ────────────────────────────────────────────────────

  async ensureIndexes(): Promise<void> {
    try {
      if (this.connection.readyState !== 1) {
        return;
      }

      await this.collection.createIndex(
        { productId: 1 },
        { unique: true, name: 'productId_unique' },
      );

      await this.collection.createIndex(
        { barcode: 1 },
        { unique: true, sparse: true, name: 'barcode_unique_sparse' },
      );

      this.logger.log('Product collection indexes verified.');
    } catch (err: unknown) {
      this.logger.warn(
        'Could not create product indexes: ' + (err as Error).message,
      );
    }
  }

  // ─── Helpers ─────────────────────────────────────────────────────────────

  private buildFilterQuery(filters: {
    category?: string;
    brand?: string;
  }): Filter<ProductDocument> {
    const query: Filter<ProductDocument> = {};

    if (filters.category && filters.category.trim() !== '') {
      query['category'] = {
        $regex: `^${escapeRegex(filters.category.trim())}$`,
        $options: 'i',
      };
    }

    if (filters.brand && filters.brand.trim() !== '') {
      query['brand'] = {
        $regex: escapeRegex(filters.brand.trim()),
        $options: 'i',
      };
    }

    return query;
  }
}

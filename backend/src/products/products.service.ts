import {
  BadRequestException,
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import { Types } from 'mongoose';
import { CreateProductDto } from './dto/create-product.dto';
import { ListProductsQueryDto } from './dto/list-products.query.dto';
import { ProductsRepository } from './products.repository';

const BARCODE_REGEX = /^\d{8,20}$/;

@Injectable()
export class ProductsService {
  constructor(private readonly productsRepository: ProductsRepository) {}

  // ─── Read ───────────────────────────────────────────────────────────────

  async findAll(query: ListProductsQueryDto) {
    const page = query.page ?? 1;
    const limit = query.limit ?? 20;
    const skip = (page - 1) * limit;

    const { items, total } = await this.productsRepository.findPage(
      skip,
      limit,
      { category: query.category, brand: query.brand },
    );

    return {
      data: items.map((item) => this.serialize(item)),
      page,
      limit,
      total,
      totalPages: limit > 0 ? Math.ceil(total / limit) : 0,
    };
  }

  async findByProductId(productId: string) {
    const product = await this.productsRepository.findByProductId(productId);

    if (!product) {
      throw new NotFoundException(
        `Product not found for productId "${productId}"`,
      );
    }

    return this.serialize(product);
  }

  async findByBarcode(rawBarcode: string) {
    if (typeof rawBarcode !== 'string') {
      throw new BadRequestException(
        'Invalid barcode: must be a numeric string of 8–20 digits',
      );
    }

    const barcode = rawBarcode.trim();

    if (!BARCODE_REGEX.test(barcode)) {
      throw new BadRequestException(
        'Invalid barcode: must be a numeric string of 8–20 digits',
      );
    }

    const product = await this.productsRepository.findByBarcode(barcode);

    if (!product) {
      throw new NotFoundException(
        `Product not found for barcode "${barcode}"`,
      );
    }

    return this.serialize(product);
  }

  // ─── Write ──────────────────────────────────────────────────────────────

  /**
   * Creates a new product.
   *
   * Integration point:
   *   When the authentication module is implemented, attach `@UseGuards(JwtAuthGuard)`
   *   to the controller endpoint `create(@Body() dto: CreateProductDto)`.
   *   The service layer remains clean and decoupled.
   */
  async create(dto: CreateProductDto) {
    const created = await this.productsRepository.create(dto);
    return this.serialize(created);
  }

  // ─── Serialisation ──────────────────────────────────────────────────────

  private serialize(document: Record<string, unknown>) {
    const serialized: Record<string, unknown> = { ...document };

    if (serialized._id instanceof Types.ObjectId) {
      serialized._id = serialized._id.toHexString();
    } else if (
      serialized._id &&
      typeof serialized._id === 'object' &&
      'toString' in serialized._id &&
      typeof (serialized._id as { toString: unknown }).toString === 'function'
    ) {
      serialized._id = (serialized._id as { toString: () => string }).toString();
    }

    return serialized;
  }
}

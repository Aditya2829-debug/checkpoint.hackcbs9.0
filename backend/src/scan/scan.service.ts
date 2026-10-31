import {
  BadRequestException,
  Injectable,
  Logger,
  ServiceUnavailableException,
} from '@nestjs/common';
import { ProductsRepository } from '../products/products.repository';
import { RatingService } from '../rating/rating.service';
import { RatingProductInput } from '../rating/rating.types';
import { GeminiService } from '../gemini/gemini.service';
import { LabelExtractionResult } from '../gemini/gemini.types';
import { ScanCacheRepository } from './scan-cache.repository';
import { ScanResponse } from './scan.types';

export function normalizeBarcode(input: string): string {
  if (typeof input !== 'string') {
    throw new BadRequestException('Barcode must be a numeric string.');
  }

  const trimmed = input.trim();
  if (!/^\d+$/.test(trimmed)) {
    throw new BadRequestException('Barcode must contain only digits.');
  }

  let normalized = trimmed;
  // 12 digits -> pad to 13 with a leading 0
  if (normalized.length === 12) {
    normalized = '0' + normalized;
  }

  // Accept 8, 13, 14
  if (![8, 13, 14].includes(normalized.length)) {
    throw new BadRequestException(
      `Invalid barcode length (${normalized.length}). Accepted lengths are 8, 12 (padded to 13), 13, or 14 digits.`,
    );
  }

  return normalized;
}

export interface ScanOptions {
  barcode: string;
  image?: {
    imageBase64: string;
    mimeType: string;
  };
  categoryHint?: 'food' | 'period' | 'pregnancy';
}

@Injectable()
export class ScanService {
  private readonly logger = new Logger(ScanService.name);
  // Ultra-fast in-memory cache for supermarket barcode scans (sub-millisecond hits)
  private readonly memoryCache = new Map<
    string,
    { response: ScanResponse; expiresAt: number }
  >();

  constructor(
    private readonly productsRepository: ProductsRepository,
    private readonly scanCacheRepository: ScanCacheRepository,
    private readonly ratingService: RatingService,
    private readonly geminiService: GeminiService,
  ) {}

  private setMemoryCache(barcode: string, response: ScanResponse): void {
    if (this.memoryCache.size > 2000) {
      const oldestKey = this.memoryCache.keys().next().value;
      if (oldestKey) this.memoryCache.delete(oldestKey);
    }
    // Cache for 2 hours in memory
    this.memoryCache.set(barcode, {
      response,
      expiresAt: Date.now() + 2 * 60 * 60 * 1000,
    });
  }

  async scan(options: ScanOptions): Promise<ScanResponse> {
    const normalizedBarcode = normalizeBarcode(options.barcode);

    // Sub-millisecond in-memory cache hit (no I/O)
    if (!options.image?.imageBase64) {
      const memHit = this.memoryCache.get(normalizedBarcode);
      if (memHit && Date.now() < memHit.expiresAt) {
        this.logger.log(
          `[Memory Cache] Instant sub-millisecond hit for barcode: ${normalizedBarcode}`,
        );
        return memHit.response;
      }
    }

    // Parallel DB and cache lookups to eliminate sequential network roundtrip latency
    const [dbProduct, cachedDoc] = await Promise.all([
      this.productsRepository.findByBarcode(normalizedBarcode),
      this.scanCacheRepository.findByBarcode(normalizedBarcode),
    ]);

    // ─── 1) IF document exists in the product collection ─────────────────────
    if (dbProduct) {
      this.logger.log(
        `[Branch 1] Product found in database for barcode: ${normalizedBarcode}`,
      );
      const res = this.handleDatabaseProduct(normalizedBarcode, dbProduct);
      this.setMemoryCache(normalizedBarcode, res);
      return res;
    }

    // ─── 2) ELSE IF document exists in the cache collection (scan_cache) ────
    if (cachedDoc) {
      this.logger.log(
        `[Branch 2] Product found in scan_cache for barcode: ${normalizedBarcode}`,
      );
      const res = this.handleCachedProduct(normalizedBarcode, cachedDoc);
      this.setMemoryCache(normalizedBarcode, res);
      return res;
    }

    // ─── 3) ELSE directly delegate to Gemini API (no user prompt needed) ────
    if (!this.geminiService.isConfigured()) {
      if (!options.image || !options.image.imageBase64) {
        this.logger.log(
          `[Branch 3] Product not found in DB, no image, and Gemini not configured for barcode: ${normalizedBarcode}`,
        );
        return {
          status: 'NOT_FOUND',
          source: null,
          needsLabelPhoto: true,
        };
      }
      throw new ServiceUnavailableException(
        'Gemini service is not configured (missing GEMINI_API_KEY).',
      );
    }

    this.logger.log(
      `[Branch 3] Barcode ${normalizedBarcode} not in DB; directly querying Gemini AI to extract & rate`,
    );
    let extraction: LabelExtractionResult;
    try {
      extraction = await this.geminiService.extractFromLabel({
        barcode: normalizedBarcode,
        imageBase64: options.image?.imageBase64,
        mimeType: options.image?.mimeType,
        categoryHint: options.categoryHint,
      });
    } catch (err: any) {
      if (!options.image?.imageBase64) {
        this.logger.warn(
          `[Branch 3] Gemini barcode lookup could not resolve ${normalizedBarcode}: ${err?.message || err}`,
        );
        return {
          status: 'NOT_FOUND',
          source: null,
          needsLabelPhoto: true,
          reason:
            'Product not identified by barcode. Please provide a photo of the product label.',
        };
      }
      throw err;
    }

    // Check if the extracted product name matches an official database record
    if (extraction.productName) {
      try {
        const matchedDbProduct =
          await this.productsRepository.findByNameOrKeyword(
            extraction.productName,
          );
        if (matchedDbProduct) {
          this.logger.log(
            `[Branch 3 -> DB Name Match] Gemini identified "${extraction.productName}" which matches official DB record "${matchedDbProduct.name}"!`,
          );
          const res = this.handleDatabaseProduct(
            normalizedBarcode,
            matchedDbProduct,
          );
          // Persist to scan_cache so future barcode scans are instant
          await this.scanCacheRepository.upsert({
            barcode: normalizedBarcode,
            category: res.product.category,
            extraction: {
              productName: matchedDbProduct.name,
              brand: matchedDbProduct.brand,
              category: res.product.category,
              per100g: {
                energyKcal: matchedDbProduct.nutrition?.caloriesKcal,
                carbs: matchedDbProduct.nutrition?.carbs,
                protein: matchedDbProduct.nutrition?.protein,
                totalFat: matchedDbProduct.nutrition?.totalFat,
                satFat: matchedDbProduct.nutrition?.satFat,
                sugars: matchedDbProduct.nutrition?.sugars,
                sodiumMg: matchedDbProduct.nutrition?.sodiumMg,
              },
              ingredients: res.product.ingredients,
              ingredientsText: matchedDbProduct.ingredientsText,
              confidence: 0.99,
            },
            source: 'database_match',
          });
          this.setMemoryCache(normalizedBarcode, res);
          return res;
        }
      } catch (err: unknown) {
        this.logger.warn(
          `Database name cross-check error: ${(err as Error).message}`,
        );
      }
    }

    const hasNutrition = Object.values(extraction.per100g || {}).some(
      (v) => v !== null && v !== undefined,
    );
    const hasIngredients =
      (extraction.ingredients && extraction.ingredients.length > 0) ||
      Boolean(extraction.ingredientsText);

    if (extraction.confidence < 0.4 || (!hasNutrition && !hasIngredients)) {
      if (!options.image || !options.image.imageBase64) {
        return {
          status: 'NOT_FOUND',
          source: null,
          needsLabelPhoto: true,
          reason:
            'Product not identified by barcode. Please provide a photo of the product label.',
        };
      }

      const reason =
        extraction.confidence < 0.4
          ? `Reading confidence too low (${extraction.confidence.toFixed(2)}). Please retake a sharp photo.`
          : 'Could not detect nutritional facts or ingredient list. Please retake photo centering on the label.';

      return {
        status: 'NEEDS_RETAKE',
        source: null,
        reason,
      };
    }

    // Rate extracted details
    const category =
      extraction.category === 'period' || extraction.category === 'pregnancy'
        ? extraction.category
        : 'food';

    const ratingInput: RatingProductInput = {
      category,
      nutrition: {
        energyKj: extraction.per100g.energyKj ?? undefined,
        sugars: extraction.per100g.sugars ?? undefined,
        satFat: extraction.per100g.satFat ?? undefined,
        sodiumMg: extraction.per100g.sodiumMg ?? undefined,
        fibre: extraction.per100g.fibre ?? undefined,
        protein: extraction.per100g.protein ?? undefined,
        fruitVegPct: extraction.per100g.fruitVegPct ?? 0,
      },
      ingredients: extraction.ingredients,
      ingredientsText: extraction.ingredientsText,
      tags: extraction.palmDerivedIngredients.length > 0 ? ['en:palm-oil'] : [],
    };

    const rating = this.ratingService.rate(ratingInput);

    // Save to scan_cache (do not write to food_database collection)
    await this.scanCacheRepository.save({
      barcode: normalizedBarcode,
      extraction,
      category,
      createdAt: new Date(),
      source: 'gemini',
    });

    const response: ScanResponse = {
      status: 'OK',
      source: 'gemini',
      product: {
        barcode: normalizedBarcode,
        name: extraction.productName,
        brand: extraction.brand,
        category,
        nutrition: extraction.per100g,
        ingredients: extraction.ingredients,
        fssaiLicense: extraction.fssaiLicense,
      },
      rating,
    };
    this.setMemoryCache(normalizedBarcode, response);

    return response;
  }

  private handleDatabaseProduct(
    barcode: string,
    doc: Record<string, any>,
  ): ScanResponse {
    const category =
      doc.category === 'period' || doc.productCategory === 'menstrual_pad'
        ? 'period'
        : 'food';

    const nutrition = doc.nutrition as Record<string, any> | undefined;
    let energyKj: number | undefined;
    if (nutrition?.caloriesKcal != null) {
      energyKj = nutrition.caloriesKcal * 4.184;
    } else if (nutrition?.energyKj != null) {
      energyKj = nutrition.energyKj;
    }

    const ingredients: string[] =
      doc.ingredientsText && typeof doc.ingredientsText === 'string'
        ? doc.ingredientsText
            .split(',')
            .map((s: string) => s.trim())
            .filter(Boolean)
        : Array.isArray(doc.ingredients)
          ? doc.ingredients
          : [];

    const tags: string[] = [];
    if (doc.palmOil === true || doc.palmOilStatus === 'confirmed') {
      tags.push('en:palm-oil');
    } else if (doc.palmOilStatus === 'possible') {
      tags.push('en:may-contain-palm-oil');
    }

    const ratingInput: RatingProductInput = {
      category,
      nutrition: nutrition
        ? {
            energyKj,
            sugars: nutrition.sugars ?? undefined,
            satFat: nutrition.satFat ?? undefined,
            sodiumMg: nutrition.sodiumMg ?? undefined,
            fibre: nutrition.fibre ?? undefined,
            protein: nutrition.protein ?? undefined,
            fruitVegPct: nutrition.fruitVegPct ?? 0,
          }
        : undefined,
      ingredients,
      ingredientsText:
        typeof doc.ingredientsText === 'string'
          ? doc.ingredientsText
          : undefined,
      tags,
    };

    const rating = this.ratingService.rate(ratingInput);

    return {
      status: 'OK',
      source: 'database',
      product: {
        barcode,
        name: (doc.name as string) ?? null,
        brand: (doc.brand as string) ?? null,
        category,
        nutrition: (doc.nutrition as Record<string, any>) ?? null,
        ingredients,
        fssaiLicense: (doc.fssaiLicense as string) ?? undefined,
      },
      rating,
    };
  }

  private handleCachedProduct(barcode: string, cachedDoc: any): ScanResponse {
    const extraction = cachedDoc.extraction;
    const category = cachedDoc.category || extraction.category || 'food';

    const ratingInput: RatingProductInput = {
      category,
      nutrition: extraction.per100g
        ? {
            energyKj: extraction.per100g.energyKj ?? undefined,
            sugars: extraction.per100g.sugars ?? undefined,
            satFat: extraction.per100g.satFat ?? undefined,
            sodiumMg: extraction.per100g.sodiumMg ?? undefined,
            fibre: extraction.per100g.fibre ?? undefined,
            protein: extraction.per100g.protein ?? undefined,
            fruitVegPct: extraction.per100g.fruitVegPct ?? 0,
          }
        : undefined,
      ingredients: extraction.ingredients || [],
      ingredientsText: extraction.ingredientsText || '',
      tags:
        extraction.palmDerivedIngredients?.length > 0 ? ['en:palm-oil'] : [],
    };

    const rating = this.ratingService.rate(ratingInput);

    return {
      status: 'OK',
      source: 'cache',
      product: {
        barcode,
        name: extraction.productName ?? null,
        brand: extraction.brand ?? null,
        category,
        nutrition: extraction.per100g ?? null,
        ingredients: extraction.ingredients ?? [],
        fssaiLicense: extraction.fssaiLicense ?? undefined,
      },
      rating,
    };
  }
}

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

  constructor(
    private readonly productsRepository: ProductsRepository,
    private readonly scanCacheRepository: ScanCacheRepository,
    private readonly ratingService: RatingService,
    private readonly geminiService: GeminiService,
  ) {}

  async scan(options: ScanOptions): Promise<ScanResponse> {
    const normalizedBarcode = normalizeBarcode(options.barcode);

    // ─── 1) IF document exists in the product collection ─────────────────────
    const dbProduct =
      await this.productsRepository.findByBarcode(normalizedBarcode);
    if (dbProduct) {
      this.logger.log(
        `[Branch 1] Product found in database for barcode: ${normalizedBarcode}`,
      );
      return this.handleDatabaseProduct(normalizedBarcode, dbProduct);
    }

    // ─── 2) ELSE IF document exists in the cache collection (scan_cache) ────
    const cachedDoc =
      await this.scanCacheRepository.findByBarcode(normalizedBarcode);
    if (cachedDoc) {
      this.logger.log(
        `[Branch 2] Product found in scan_cache for barcode: ${normalizedBarcode}`,
      );
      return this.handleCachedProduct(normalizedBarcode, cachedDoc);
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

    return {
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

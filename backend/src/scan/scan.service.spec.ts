import {
  BadRequestException,
  ServiceUnavailableException,
} from '@nestjs/common';
import { ScanService, normalizeBarcode } from './scan.service';
import { ProductsRepository } from '../products/products.repository';
import { ScanCacheRepository } from './scan-cache.repository';
import { RatingService } from '../rating/rating.service';
import { GeminiService } from '../gemini/gemini.service';

describe('ScanService Unit Tests (All Decision Branches)', () => {
  let scanService: ScanService;
  let productsRepository: jest.Mocked<ProductsRepository>;
  let scanCacheRepository: jest.Mocked<ScanCacheRepository>;
  let ratingService: RatingService;
  let geminiService: jest.Mocked<GeminiService>;

  beforeEach(() => {
    productsRepository = {
      findByBarcode: jest.fn(),
    } as any;

    scanCacheRepository = {
      findByBarcode: jest.fn(),
      save: jest.fn(),
    } as any;

    ratingService = new RatingService();

    geminiService = {
      isConfigured: jest.fn(),
      extractFromLabel: jest.fn(),
    } as any;

    scanService = new ScanService(
      productsRepository,
      scanCacheRepository,
      ratingService,
      geminiService,
    );
  });

  describe('normalizeBarcode', () => {
    it('accepts 8-digit barcode', () => {
      expect(normalizeBarcode('12345678')).toBe('12345678');
    });

    it('pads 12-digit barcode with a leading 0 to 13 digits', () => {
      expect(normalizeBarcode('123456789012')).toBe('0123456789012');
    });

    it('accepts 13-digit and 14-digit barcodes', () => {
      expect(normalizeBarcode('8901030383748')).toBe('8901030383748');
      expect(normalizeBarcode('18901030383745')).toBe('18901030383745');
    });

    it('rejects invalid lengths or non-digit characters with BadRequestException', () => {
      expect(() => normalizeBarcode('123')).toThrow(BadRequestException);
      expect(() => normalizeBarcode('12345678901234567')).toThrow(
        BadRequestException,
      );
      expect(() => normalizeBarcode('12345678a')).toThrow(BadRequestException);
    });
  });

  describe('Decision Tree Branches', () => {
    it('Branch 1: Database hit returns source "database" and NEVER calls Gemini', async () => {
      productsRepository.findByBarcode.mockResolvedValueOnce({
        name: 'Database Biscuit',
        brand: 'Britannia',
        category: 'BISCUIT',
        ingredientsText: 'Wheat flour, Sugar',
        nutrition: {
          caloriesKcal: 450,
          sugars: 20,
          satFat: 5,
          sodiumMg: 200,
          fibre: 1,
          protein: 5,
        },
      });

      const res = await scanService.scan({ barcode: '8901030383748' });

      expect(res.status).toBe('OK');
      expect(res.source).toBe('database');
      expect(res.product?.name).toBe('Database Biscuit');
      expect(res.rating?.grade).toBeDefined();
      expect(geminiService.extractFromLabel).not.toHaveBeenCalled();
    });

    it('Branch 2: Cache hit returns source "cache", re-rates, and NEVER calls Gemini', async () => {
      productsRepository.findByBarcode.mockResolvedValueOnce(null);
      scanCacheRepository.findByBarcode.mockResolvedValueOnce({
        barcode: '8901030383748',
        category: 'food',
        createdAt: new Date(),
        source: 'gemini',
        extraction: {
          productName: 'Cached Oats',
          brand: 'Quaker',
          category: 'food',
          per100g: {
            energyKj: 1500,
            sugars: 1,
            satFat: 1.2,
            sodiumMg: 5,
            fibre: 10,
            protein: 13,
            fruitVegPct: 0,
          },
          ingredients: ['Oats'],
          ingredientsText: 'Oats',
          palmDerivedIngredients: [],
          confidence: 0.95,
        },
      } as any);

      const res = await scanService.scan({ barcode: '8901030383748' });

      expect(res.status).toBe('OK');
      expect(res.source).toBe('cache');
      expect(res.product?.name).toBe('Cached Oats');
      expect(res.rating?.grade).toBe('A');
      expect(geminiService.extractFromLabel).not.toHaveBeenCalled();
    });

    it('Branch 3a: Product missing, no image, and Gemini NOT configured returns NOT_FOUND with needsLabelPhoto: true', async () => {
      productsRepository.findByBarcode.mockResolvedValueOnce(null);
      scanCacheRepository.findByBarcode.mockResolvedValueOnce(null);
      geminiService.isConfigured.mockReturnValue(false);

      const res = await scanService.scan({ barcode: '8901030383748' });

      expect(res.status).toBe('NOT_FOUND');
      expect(res.needsLabelPhoto).toBe(true);
      expect(geminiService.extractFromLabel).not.toHaveBeenCalled();
    });

    it('Branch 3b: Product missing, no image, but Gemini IS configured directly queries Gemini and returns graded product', async () => {
      productsRepository.findByBarcode.mockResolvedValueOnce(null);
      scanCacheRepository.findByBarcode.mockResolvedValueOnce(null);
      geminiService.isConfigured.mockReturnValue(true);
      geminiService.extractFromLabel.mockResolvedValueOnce({
        productName: 'Bourbon Biscuit',
        brand: 'Britannia',
        category: 'food',
        confidence: 0.95,
        per100g: {
          energyKj: 2000,
          energyKcal: 480,
          sugars: 35,
          carbs: 70,
          satFat: 10,
          salt: 0.5,
          sodiumMg: 200,
          fibre: 2,
          protein: 5,
          fruitVegPct: 0,
        },
        servingSizeG: 20,
        ingredients: ['Wheat flour', 'Sugar', 'Palm oil'],
        ingredientsText: 'Wheat flour, Sugar, Palm oil',
        palmDerivedIngredients: ['Palm oil'],
        fssaiLicense: '10015043001129',
        notes: null,
      });

      const res = await scanService.scan({ barcode: '8901030383748' });

      expect(res.status).toBe('OK');
      expect(res.source).toBe('gemini');
      expect(res.product?.name).toBe('Bourbon Biscuit');
      expect(res.rating?.grade).toBeDefined();
      expect(geminiService.extractFromLabel).toHaveBeenCalledWith(
        expect.objectContaining({ barcode: '8901030383748' }),
      );
      expect(scanCacheRepository.save).toHaveBeenCalledTimes(1);
    });

    it('Branch 4: Image provided but Gemini is not configured throws 503 ServiceUnavailableException', async () => {
      productsRepository.findByBarcode.mockResolvedValueOnce(null);
      scanCacheRepository.findByBarcode.mockResolvedValueOnce(null);
      geminiService.isConfigured.mockReturnValue(false);

      await expect(
        scanService.scan({
          barcode: '8901030383748',
          image: { imageBase64: 'base64str', mimeType: 'image/jpeg' },
        }),
      ).rejects.toThrow(ServiceUnavailableException);

      expect(geminiService.extractFromLabel).not.toHaveBeenCalled();
    });

    it('Branch 5a: Low confidence (< 0.5) returns NEEDS_RETAKE', async () => {
      productsRepository.findByBarcode.mockResolvedValueOnce(null);
      scanCacheRepository.findByBarcode.mockResolvedValueOnce(null);
      geminiService.isConfigured.mockReturnValue(true);
      geminiService.extractFromLabel.mockResolvedValueOnce({
        productName: null,
        brand: null,
        category: 'food',
        confidence: 0.35,
        per100g: {
          energyKj: null,
          energyKcal: null,
          sugars: null,
          carbs: null,
          satFat: null,
          salt: null,
          sodiumMg: null,
          fibre: null,
          protein: null,
          fruitVegPct: null,
        },
        servingSizeG: null,
        ingredients: [],
        ingredientsText: '',
        palmDerivedIngredients: [],
        fssaiLicense: null,
        notes: null,
      });

      const res = await scanService.scan({
        barcode: '8901030383748',
        image: { imageBase64: 'blurred_image', mimeType: 'image/jpeg' },
      });

      expect(res.status).toBe('NEEDS_RETAKE');
      expect(res.reason).toContain('too low');
      expect(scanCacheRepository.save).not.toHaveBeenCalled();
    });

    it('Branch 5b: Successful extraction saves to scan_cache and returns graded result with source "gemini"', async () => {
      productsRepository.findByBarcode.mockResolvedValueOnce(null);
      scanCacheRepository.findByBarcode.mockResolvedValueOnce(null);
      geminiService.isConfigured.mockReturnValue(true);
      geminiService.extractFromLabel.mockResolvedValueOnce({
        productName: 'Honey Jam',
        brand: 'Eatopia',
        category: 'food',
        confidence: 0.88,
        per100g: {
          energyKj: 1188,
          energyKcal: 284,
          sugars: 63.3,
          carbs: 70,
          satFat: 0,
          salt: null,
          sodiumMg: 28,
          fibre: 2.6,
          protein: 0.7,
          fruitVegPct: 50,
        },
        servingSizeG: 15,
        ingredients: ['Blueberries', 'Honey', 'Strawberries'],
        ingredientsText: 'Blueberries, Honey, Strawberries',
        palmDerivedIngredients: [],
        fssaiLicense: '10012011000168',
        notes: null,
      });

      const res = await scanService.scan({
        barcode: '8901030383748',
        image: { imageBase64: 'valid_label_data', mimeType: 'image/jpeg' },
      });

      expect(res.status).toBe('OK');
      expect(res.source).toBe('gemini');
      expect(res.product?.name).toBe('Honey Jam');
      expect(res.rating?.grade).toBeDefined();
      expect(scanCacheRepository.save).toHaveBeenCalledTimes(1);
    });
  });
});

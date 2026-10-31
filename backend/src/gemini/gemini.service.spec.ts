import { ConfigService } from '@nestjs/config';
import { ServiceUnavailableException } from '@nestjs/common';
import { GeminiService } from './gemini.service';

describe('GeminiService Unit Tests', () => {
  let geminiService: GeminiService;
  let configService: ConfigService;

  beforeEach(() => {
    configService = new ConfigService({});
    geminiService = new GeminiService(configService);
  });

  it('reports not configured when API key is missing', () => {
    expect(geminiService.isConfigured()).toBe(false);
  });

  it('throws ServiceUnavailableException if extractFromLabel is called while unconfigured', async () => {
    await expect(
      geminiService.extractFromLabel({
        imageBase64: 'test',
        mimeType: 'image/jpeg',
      }),
    ).rejects.toThrow(ServiceUnavailableException);
  });

  it('validates and normalizes raw extraction correctly', () => {
    const raw = {
      productName: 'Nutty Cookies',
      brand: 'TestBrand',
      category: 'food',
      confidence: 0.92,
      per100g: {
        energyKcal: 500, // should convert to kJ
        sugars: 25,
        carbs: 60,
        satFat: 10,
        salt: 1.5, // should convert to sodiumMg = 600
        protein: 7,
        fibre: 4,
        fruitVegPct: -5, // out of range, should become null
      },
      ingredients: ['Wheat flour', 'Sugar', 'Palm oil'],
      ingredientsText: 'Wheat flour, Sugar, Palm oil',
    };

    const validated = geminiService.validateAndNormalizeExtraction(raw);
    expect(validated.productName).toBe('Nutty Cookies');
    expect(validated.confidence).toBe(0.92);
    expect(validated.per100g.energyKj).toBeCloseTo(2092, 0);
    expect(validated.per100g.sodiumMg).toBe(600);
    expect(validated.per100g.fruitVegPct).toBeNull();
    expect(validated.ingredients).toHaveLength(3);
  });

  it('rejects numbers strictly exceeding logical bounds (e.g. sugar > 100g, energy > 3900)', () => {
    const raw = {
      confidence: 0.8,
      per100g: {
        energyKj: 5000, // exceeds 3900
        sugars: 120, // exceeds 100
        sodiumMg: 50000, // exceeds 40000
      },
      ingredients: ['Water'],
    };

    const validated = geminiService.validateAndNormalizeExtraction(raw);
    expect(validated.per100g.energyKj).toBeNull();
    expect(validated.per100g.sugars).toBeNull();
    expect(validated.per100g.sodiumMg).toBeNull();
  });
});

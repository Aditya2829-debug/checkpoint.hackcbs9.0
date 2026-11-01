import { RatingService } from './rating.service';
import { computeNutriScore, kcalToKj, saltToSodiumMg } from './nutri-score';
import { detectPalmOil } from './palm-oil';
import { detectAdditives } from './additives';

describe('Phase 1 - Rating Engine Unit Tests', () => {
  let ratingService: RatingService;

  beforeEach(() => {
    ratingService = new RatingService();
  });

  describe('Nutri-Score Computation', () => {
    it('oats-like product gives score -5 and grade A', () => {
      const oats = {
        energyKj: 1500,
        sugars: 1,
        satFat: 1.2,
        sodiumMg: 5,
        fibre: 10,
        protein: 13,
        fruitVegPct: 0,
      };
      const res = computeNutriScore(oats);
      expect(res.score).toBe(-5);
      expect(res.grade).toBe('A');
      expect(res.dataQuality).toBe('complete');
    });

    it('biscuit-like product gives N=22, score 21, grade E (protein excluded)', () => {
      const biscuit = {
        energyKj: 2000,
        sugars: 25,
        satFat: 9,
        sodiumMg: 400,
        fibre: 1.5,
        protein: 6,
        fruitVegPct: 0,
      };
      const res = computeNutriScore(biscuit);
      expect(res.negativePoints).toBe(22);
      expect(res.score).toBe(21);
      expect(res.grade).toBe('E');
      expect(
        res.reasons.some((r) =>
          r.includes('excluded: high negative points rule'),
        ),
      ).toBe(true);
    });

    it('boundary test: a value exactly equal to a threshold does NOT score that point', () => {
      // 335 is the first threshold for energyKj. Value 335 should score 0 points.
      const boundaryInput = {
        energyKj: 335,
        sugars: 4.5,
        satFat: 1,
        sodiumMg: 90,
        fibre: 0.9,
        protein: 1.6,
        fruitVegPct: 40,
      };
      const res = computeNutriScore(boundaryInput);
      expect(res.negativePoints).toBe(0);
      expect(res.positivePoints).toBe(0);
      expect(res.score).toBe(0);
      expect(res.grade).toBe('B');
    });

    it('missing values treat numbers as 0 and set dataQuality to partial', () => {
      const partial = computeNutriScore({
        energyKj: 1000,
      });
      expect(partial.dataQuality).toBe('partial');
    });

    it('conversion helpers work correctly', () => {
      expect(saltToSodiumMg(1)).toBe(400);
      expect(saltToSodiumMg(2.5)).toBe(1000);
      expect(kcalToKj(100)).toBeCloseTo(418.4, 2);
    });

    it('Coca-Cola beverage with 10.6g sugar receives Grade E or D, NEVER Grade B', () => {
      const coke = {
        energyKj: 184,
        sugars: 10.6,
        satFat: 0,
        sodiumMg: 8.5,
        fibre: 0,
        protein: 0,
        fruitVegPct: 0,
        isBeverage: true,
      };
      const res = computeNutriScore(coke);
      expect(['D', 'E']).toContain(res.grade);
      expect(res.grade).not.toBe('B');
      expect(res.grade).not.toBe('A');
      expect(res.reasons.some((r) => r.toLowerCase().includes('high sugar'))).toBe(true);
    });

    it('solid food with 25g sugar is downgraded to D or E', () => {
      const sweetFood = {
        energyKj: 1600,
        sugars: 25,
        satFat: 3,
        sodiumMg: 150,
        fibre: 1,
        protein: 3,
        fruitVegPct: 0,
        isBeverage: false,
      };
      const res = computeNutriScore(sweetFood);
      expect(['D', 'E']).toContain(res.grade);
      expect(res.grade).not.toBe('B');
      expect(res.grade).not.toBe('A');
    });
  });

  describe('Palm Oil Detection', () => {
    it('detects palm oil correctly and handles tags', () => {
      expect(detectPalmOil('Refined Palm Oil, Wheat Flour')).toBe('yes');
      expect(detectPalmOil('Palmolein Oil, Salt')).toBe('yes');
      expect(detectPalmOil('Palm kernel fat')).toBe('yes');
      expect(detectPalmOil('Something', ['en:palm-oil'])).toBe('yes');
    });

    it('recognizes generic edible vegetable oil as possible', () => {
      expect(detectPalmOil('Edible vegetable oil, sugar')).toBe('possible');
      expect(detectPalmOil('Something', ['en:may-contain-palm-oil'])).toBe(
        'possible',
      );
    });

    it('does not flag ascorbyl palmitate alone as palm oil', () => {
      expect(detectPalmOil('Ascorbyl palmitate, water')).toBe('no');
      expect(detectPalmOil('Retinyl palmitate')).toBe('no');
    });

    it('exact tag equality: en:palm-oil-free is not a hit', () => {
      expect(detectPalmOil('Sunflower oil, salt', ['en:palm-oil-free'])).toBe(
        'no',
      );
    });
  });

  describe('Additives Detection', () => {
    it('finds E-numbers and INS codes', () => {
      const ingredients = [
        'Sugar',
        'Acidity Regulator (INS 330)',
        'Raising Agents 500(ii)',
        'Emulsifier E 472e',
        'Colour (E150d)',
      ];
      const result = detectAdditives(ingredients);
      expect(result.count).toBe(4);
      expect(result.codes).toContain('INS 330');
      expect(result.codes).toContain('INS 500(ii)');
      expect(result.codes).toContain('E472e');
      expect(result.codes).toContain('E150d');
    });

    it('finds bracketed additives like Raising Agents [503(ii), 500(ii)] and Emulsifiers [322, 471]', () => {
      const ingredients = [
        'Wheat flour',
        'Raising Agents [503(ii), 500(ii)]',
        'Emulsifiers [322, 471, 472e]',
      ];
      const result = detectAdditives(ingredients);
      expect(result.count).toBe(5);
      expect(result.codes).toContain('INS 503(ii)');
      expect(result.codes).toContain('INS 500(ii)');
      expect(result.codes).toContain('INS 322');
      expect(result.codes).toContain('INS 471');
      expect(result.codes).toContain('INS 472e');
    });
  });

  describe('RatingService.rate() End-to-End Evaluation', () => {
    it('downgrades grade by one step when palm oil is present (C -> D, E -> E)', () => {
      // Create a food that scores C (e.g. score between 3 and 10)
      const foodC = {
        category: 'food' as const,
        nutrition: {
          energyKj: 1200, // 3 pts
          sugars: 15, // 3 pts
          satFat: 2.5, // 2 pts
          sodiumMg: 150, // 1 pt -> total N = 9 pts
          fibre: 1, // 1 pt
          protein: 2, // 1 pt
          fruitVegPct: 0,
        }, // score = 9 - 2 = 7 -> grade C
        ingredients: ['Palm oil', 'Wheat'],
      };
      const resultC = ratingService.rate(foodC);
      expect(resultC.palmOil).toBe('yes');
      expect(resultC.grade).toBe('D');
      expect(
        resultC.reasons.some((r) => r.includes('downgraded from C to D')),
      ).toBe(true);

      // Food E stays E
      const foodE = {
        category: 'food' as const,
        nutrition: {
          energyKj: 3500,
          sugars: 50,
          satFat: 15,
          sodiumMg: 1000,
          fibre: 0,
          protein: 0,
          fruitVegPct: 0,
        },
        ingredients: ['Palm oil'],
      };
      const resultE = ratingService.rate(foodE);
      expect(resultE.grade).toBe('E');
    });

    it('possible palm oil leaves grade unchanged and adds a warning', () => {
      const food = {
        category: 'food' as const,
        nutrition: {
          energyKj: 1500,
          sugars: 1,
          satFat: 1.2,
          sodiumMg: 5,
          fibre: 10,
          protein: 13,
          fruitVegPct: 0,
        },
        ingredients: ['Edible Vegetable Oil'],
      };
      const result = ratingService.rate(food);
      expect(result.grade).toBe('A');
      expect(result.warnings.some((w) => w.includes('unlisted palm oil'))).toBe(
        true,
      );
    });

    it('missing nutrition returns grade null and a warning', () => {
      const result = ratingService.rate({
        category: 'food',
        ingredients: ['Wheat flour', 'Sugar'],
      });
      expect(result.grade).toBeNull();
      expect(
        result.warnings.some((w) =>
          w.includes('Insufficient nutritional information'),
        ),
      ).toBe(true);
    });

    it('period product grades based on transparent rubric', () => {
      const organicPad = {
        category: 'period' as const,
        ingredients: [
          'Organic cotton top layer',
          'Biodegradable wood pulp core',
          'Dermatologically tested',
        ],
      };
      const resOrganic = ratingService.rate(organicPad);
      expect(resOrganic.grade).toBe('A');

      const conventionalSyntheticPad = {
        category: 'period' as const,
        ingredients: [
          'Chlorine bleached materials',
          'Synthetic Fragrance',
          'Polyethylene topsheet',
        ],
      };
      const resBad = ratingService.rate(conventionalSyntheticPad);
      expect(resBad.grade).toBe('E');
    });

    it('pregnancy product adds warnings and medical disclaimer', () => {
      const pregnancyItem = {
        category: 'pregnancy' as const,
        nutrition: {
          energyKj: 500,
          sugars: 2,
          satFat: 0.5,
          sodiumMg: 100,
          fibre: 2,
          protein: 5,
          fruitVegPct: 0,
        },
        ingredients: ['Guarana extract', 'Caffeine', 'St John Wort'],
      };
      const res = ratingService.rate(pregnancyItem);
      expect(res.warnings.some((w) => w.includes('caffeine'))).toBe(true);
      expect(res.warnings.some((w) => w.includes('St. John'))).toBe(true);
      expect(res.warnings.some((w) => w.includes('Not medical advice'))).toBe(
        true,
      );
    });
  });
});

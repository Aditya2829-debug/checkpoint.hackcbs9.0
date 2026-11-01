import { Injectable } from '@nestjs/common';
import * as fs from 'fs';
import * as path from 'path';
import {
  Grade,
  PalmOilResult,
  RatingProductInput,
  RatingResult,
} from './rating.types';
import { computeNutriScore, METHOD_NOTE } from './nutri-score';
import { detectPalmOil } from './palm-oil';
import { detectAdditives } from './additives';

interface PregnancyFlag {
  id: string;
  name: string;
  patterns: string[];
  warning: string;
}

// NOTE: This list of pregnancy flags must be verified against a reliable medical source by the clinical/medical team before production deployment.
const PREGNANCY_DISCLAIMER =
  'Not medical advice; consult your doctor or healthcare provider.';

@Injectable()
export class RatingService {
  private readonly pregnancyFlags: PregnancyFlag[] = [];

  constructor() {
    try {
      const filePath = path.resolve(__dirname, 'data/pregnancy-flags.json');
      if (fs.existsSync(filePath)) {
        const raw = fs.readFileSync(filePath, 'utf-8');
        this.pregnancyFlags = JSON.parse(raw);
      }
    } catch {
      // Fallback in case of runtime path resolution differences
      this.pregnancyFlags = [];
    }
  }

  rate(product: RatingProductInput): RatingResult {
    const ingredientsText =
      product.ingredientsText || product.ingredients.join(', ');
    const palmOil = detectPalmOil(ingredientsText, product.tags);
    const additives = detectAdditives(
      product.ingredients.length > 0 ? product.ingredients : [ingredientsText],
    );

    const warnings: string[] = [];
    const reasons: string[] = [];

    if (product.category === 'period') {
      return this.ratePeriodProduct(
        product,
        ingredientsText,
        palmOil,
        additives,
      );
    }

    // Food category evaluation (also default if unknown or pregnancy)
    let grade: Grade | null = null;
    let score: number | null = null;
    let dataQuality = product.nutrition ? 'complete' : 'partial';

    if (
      !product.nutrition ||
      Object.values(product.nutrition).every(
        (v) => v === undefined || v === null,
      )
    ) {
      warnings.push(
        'Insufficient nutritional information to compute food grade.',
      );
      return {
        grade: null,
        score: null,
        reasons: [],
        warnings,
        palmOil,
        additives,
        dataQuality: 'partial',
        methodNote: METHOD_NOTE,
      };
    }

    const isBeverage =
      product.isBeverage === true ||
      product.nutrition?.isBeverage === true ||
      /coca[- ]?cola|pepsi|thums\s*up|sprite|fanta|mirinda|frooti|maaza|slice|sting|red\s*bull|mountain\s*dew|limca|appy|juice|soda|drink|beverage|cola|sharbat|nectar|squash|iced\s*tea|carbonated/i.test(
        `${product.name || ''} ${(product.tags || []).join(' ')} ${ingredientsText}`,
      ) ||
      (Boolean(product.nutrition?.sugars) &&
        (product.nutrition?.satFat ?? 0) === 0 &&
        (product.nutrition?.protein ?? 0) === 0 &&
        (product.nutrition?.fibre ?? 0) === 0 &&
        (product.nutrition?.energyKj ?? 0) < 1200);

    const nutriResult = computeNutriScore({
      ...product.nutrition,
      isBeverage,
    });
    grade = nutriResult.grade;
    score = nutriResult.score;
    reasons.push(...nutriResult.reasons);
    dataQuality = nutriResult.dataQuality;

    // Hard high-sugar guardrails:
    // Any high-sugar item MUST be D or E (never B or A)
    const sugars = product.nutrition.sugars ?? 0;
    if (isBeverage) {
      if (sugars >= 6) {
        if (grade === 'A' || grade === 'B' || grade === 'C') {
          grade = sugars >= 10 ? 'E' : 'D';
        }
        warnings.push(
          `High liquid sugar (${sugars}g/100ml) causes rapid glycemic spikes and increases metabolic risk.`,
        );
      } else if (sugars >= 3.5 && (grade === 'A' || grade === 'B')) {
        grade = 'C';
      }
    } else {
      if (sugars >= 25) {
        if (grade === 'A' || grade === 'B' || grade === 'C') {
          grade = sugars >= 35 ? 'E' : 'D';
        }
        warnings.push(
          `High sugar (${sugars}g/100g) exceeds 50% of recommended daily sugar intake.`,
        );
      } else if (sugars >= 14 && (grade === 'A' || grade === 'B' || grade === 'C')) {
        grade = 'D';
        warnings.push(
          `High sugar (${sugars}g/100g) exceeds safe dietary benchmarks (marked Grade D).`,
        );
      }
    }

    // Palm oil penalty: Immediate Grade D/E penalty
    if (palmOil === 'yes') {
      const origGrade = grade;
      if (grade === 'A' || grade === 'B' || grade === 'C') {
        grade = 'D';
      }
      reasons.unshift(
        `Contains palm oil: grade downgraded from ${origGrade} to ${grade} (High saturated palmitic acid & cardiovascular risk)`,
      );
      warnings.push('Contains palm oil / palmolein: high saturated fat penalty applied.');
    } else if (palmOil === 'possible') {
      warnings.push('May contain unlisted palm oil / generic vegetable oil.');
    }

    // Additives warning
    if (additives.count >= 5) {
      warnings.push(
        `High number of additives detected (${additives.count} additives): ${additives.codes.join(', ')}`,
      );
    }

    // Pregnancy category specific checks
    if (product.category === 'pregnancy') {
      this.applyPregnancyFlags(ingredientsText, warnings);
    }

    return {
      grade,
      score,
      reasons,
      warnings,
      palmOil,
      additives,
      dataQuality: dataQuality as 'complete' | 'partial',
      methodNote: METHOD_NOTE,
    };
  }

  private downgradeGrade(grade: Grade): Grade {
    switch (grade) {
      case 'A':
        return 'B';
      case 'B':
        return 'C';
      case 'C':
        return 'D';
      case 'D':
      case 'E':
        return 'E';
    }
  }

  private ratePeriodProduct(
    product: RatingProductInput,
    text: string,
    palmOil: PalmOilResult,
    additives: { count: number; codes: string[] },
  ): RatingResult {
    const reasons: string[] = [];
    const warnings: string[] = [];
    const lower = text.toLowerCase();
    let score = 0;

    // Rubric:
    // fragrance/perfume -2
    if (/fragrance|perfume|parfum/i.test(lower)) {
      score -= 2;
      reasons.push('Contains synthetic fragrance/perfume (-2 points)');
    }

    // chlorine bleached -2
    if (/chlorine\s*bleach|elemental\s*chlorine/i.test(lower)) {
      score -= 2;
      reasons.push('Contains chlorine bleached materials (-2 points)');
    }

    // plastic or polyethylene top sheet -1
    if (
      /plastic|polyethylene|polypropylene|pe\s*film|pe\s*backing/i.test(lower)
    ) {
      score -= 1;
      reasons.push('Contains plastic/polyethylene synthetic layer (-1 point)');
    }

    // organic cotton +2
    if (/organic\s*cotton/i.test(lower)) {
      score += 2;
      reasons.push('Made with organic cotton (+2 points)');
    } else if (/cotton/i.test(lower)) {
      // plain cotton +1 (only if not organic)
      score += 1;
      reasons.push('Made with conventional cotton (+1 point)');
    }

    // biodegradable/compostable +1
    if (/biodegradable|compostable|bamboo|cornstarch/i.test(lower)) {
      score += 1;
      reasons.push('Biodegradable/compostable materials (+1 point)');
    }

    // dermatologically tested +1
    if (/dermatologically\s*tested|hypoallergenic/i.test(lower)) {
      score += 1;
      reasons.push('Dermatologically tested (+1 point)');
    }

    // Map total: >=3 A, 2 B, 1 C, 0 D, <0 E
    let grade: Grade;
    if (score >= 3) {
      grade = 'A';
    } else if (score === 2) {
      grade = 'B';
    } else if (score === 1) {
      grade = 'C';
    } else if (score === 0) {
      grade = 'D';
    } else {
      grade = 'E';
    }

    return {
      grade,
      score,
      reasons,
      warnings,
      palmOil,
      additives,
      dataQuality: 'complete',
      methodNote: 'Rule-based menstrual hygiene material rubric',
    };
  }

  private applyPregnancyFlags(text: string, warnings: string[]): void {
    const lower = text.toLowerCase();
    for (const flag of this.pregnancyFlags) {
      const match = flag.patterns.some((pattern) =>
        lower.includes(pattern.toLowerCase()),
      );
      if (match) {
        warnings.push(flag.warning);
      }
    }
    warnings.push(PREGNANCY_DISCLAIMER);
  }
}

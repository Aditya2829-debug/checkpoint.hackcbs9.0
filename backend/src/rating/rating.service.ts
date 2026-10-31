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

    const nutriResult = computeNutriScore(product.nutrition);
    grade = nutriResult.grade;
    score = nutriResult.score;
    reasons.push(...nutriResult.reasons);
    dataQuality = nutriResult.dataQuality;

    // Palm oil penalty
    if (palmOil === 'yes') {
      const downgraded = this.downgradeGrade(grade);
      reasons.push(
        `Contains palm oil: grade downgraded from ${grade} to ${downgraded}`,
      );
      grade = downgraded;
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

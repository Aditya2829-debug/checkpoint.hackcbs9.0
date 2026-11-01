import {
  Grade,
  NutriScoreInput,
  NutriScoreResult,
  DataQuality,
} from './rating.types';

export const METHOD_NOTE = 'Nutri-Score-based, aligned with official FSSAI & EU standards';

// General food thresholds
export const ENERGY_THRESHOLDS = [
  335, 670, 1005, 1340, 1675, 2010, 2345, 2680, 3015, 3350,
];
export const SUGARS_THRESHOLDS = [4.5, 9, 13.5, 18, 22.5, 27, 31, 36, 40, 45];
export const SAT_FAT_THRESHOLDS = [1, 2, 3, 4, 5, 6, 7, 8, 9, 10];
export const SODIUM_THRESHOLDS = [
  90, 180, 270, 360, 450, 540, 630, 720, 810, 900,
];
export const FIBRE_THRESHOLDS = [0.9, 1.9, 2.8, 3.7, 4.7];
export const PROTEIN_THRESHOLDS = [1.6, 3.2, 4.8, 6.4, 8.0];

// Official Nutri-Score Beverage Category Thresholds
export const ENERGY_THRESHOLDS_BEVERAGES = [
  0, 30, 60, 90, 120, 150, 180, 210, 240, 270,
];
export const SUGARS_THRESHOLDS_BEVERAGES = [
  0, 1.5, 3.0, 4.5, 6.0, 7.5, 9.0, 10.5, 12.0, 13.5,
];

export function kcalToKj(kcal: number): number {
  return kcal * 4.184;
}

export function saltToSodiumMg(saltG: number): number {
  return saltG * 400;
}

function countStrictlyExceeded(val: number, thresholds: number[]): number {
  let count = 0;
  for (const t of thresholds) {
    if (val > t) {
      count++;
    } else {
      break;
    }
  }
  return count;
}

function computeFruitVegPoints(pct: number): number {
  if (pct > 80) return 5;
  if (pct > 60) return 2;
  if (pct > 40) return 1;
  return 0;
}

export function computeNutriScore(input: NutriScoreInput): NutriScoreResult {
  const isComplete =
    input.energyKj !== undefined &&
    input.sugars !== undefined &&
    input.satFat !== undefined &&
    input.sodiumMg !== undefined &&
    input.fibre !== undefined &&
    input.protein !== undefined &&
    input.fruitVegPct !== undefined;

  const dataQuality: DataQuality = isComplete ? 'complete' : 'partial';

  const energyKj = input.energyKj ?? 0;
  const sugars = input.sugars ?? 0;
  const satFat = input.satFat ?? 0;
  const sodiumMg = input.sodiumMg ?? 0;
  const fibre = input.fibre ?? 0;
  const protein = input.protein ?? 0;
  const fruitVegPct = input.fruitVegPct ?? 0;
  const isBeverage = Boolean(input.isBeverage);

  let energyPts = 0;
  let sugarsPts = 0;

  if (isBeverage) {
    energyPts = countStrictlyExceeded(energyKj, ENERGY_THRESHOLDS_BEVERAGES);
    sugarsPts = countStrictlyExceeded(sugars, SUGARS_THRESHOLDS_BEVERAGES);
  } else {
    energyPts = countStrictlyExceeded(energyKj, ENERGY_THRESHOLDS);
    sugarsPts = countStrictlyExceeded(sugars, SUGARS_THRESHOLDS);
  }

  const satFatPts = countStrictlyExceeded(satFat, SAT_FAT_THRESHOLDS);
  const sodiumPts = countStrictlyExceeded(sodiumMg, SODIUM_THRESHOLDS);

  const fibrePts = countStrictlyExceeded(fibre, FIBRE_THRESHOLDS);
  const proteinPts = countStrictlyExceeded(protein, PROTEIN_THRESHOLDS);
  const fruitVegPts = computeFruitVegPoints(fruitVegPct);

  const N = energyPts + sugarsPts + satFatPts + sodiumPts;

  let score: number;
  let proteinCounted = true;
  let grade: Grade;

  if (isBeverage) {
    const isWater = energyKj === 0 && sugars === 0 && satFat === 0;
    score = N - fruitVegPts;

    if (isWater) {
      grade = 'A';
    } else if (score <= 2) {
      grade = 'B';
    } else if (score <= 6) {
      grade = 'C';
    } else if (score <= 9) {
      grade = 'D';
    } else {
      grade = 'E';
    }

    // High sugar guardrails for beverages:
    // Any beverage with >= 8g sugar/100ml (e.g. Coke, Pepsi, sodas at 10.6g) is severe high sugar
    // and CANNOT be Grade A, B, or C. It must be Grade D or E.
    if (sugars >= 8) {
      if (grade === 'A' || grade === 'B' || grade === 'C') {
        grade = sugars >= 10 ? 'E' : 'D';
      }
    } else if (sugars >= 4.5) {
      if (grade === 'A' || grade === 'B') {
        grade = 'C';
      }
    }
  } else {
    if (N < 11) {
      score = N - (fibrePts + proteinPts + fruitVegPts);
    } else if (fruitVegPts < 5) {
      score = N - (fibrePts + fruitVegPts);
      proteinCounted = false;
    } else {
      score = N - (fibrePts + proteinPts + fruitVegPts);
    }

    if (score <= -1) {
      grade = 'A';
    } else if (score <= 2) {
      grade = 'B';
    } else if (score <= 10) {
      grade = 'C';
    } else if (score <= 18) {
      grade = 'D';
    } else {
      grade = 'E';
    }

    // High sugar guardrails for solid foods:
    // If sugar >= 15g/100g (FSSAI high sugar threshold), product CANNOT be Grade A or B!
    if (sugars >= 25) {
      if (grade === 'A' || grade === 'B' || grade === 'C') {
        grade = sugars >= 35 ? 'E' : 'D';
      }
    } else if (sugars >= 15) {
      if (grade === 'A' || grade === 'B') {
        grade = 'D';
      }
    } else if (sugars >= 10 && (satFat >= 5 || energyKj >= 1675)) {
      if (grade === 'A' || grade === 'B') {
        grade = 'D';
      }
    }
  }

  // Build reasons: top 3 negative contributors + positive contributors
  const negativeContributors = [
    {
      label: 'energy',
      name: isBeverage ? 'High energy beverage' : 'High energy',
      value: `${Number(energyKj.toFixed(1))} kJ per 100 ${isBeverage ? 'ml' : 'g'}`,
      points: energyPts,
    },
    {
      label: 'sugars',
      name: sugars >= (isBeverage ? 6 : 15) ? 'Excessive high sugar' : 'High sugar',
      value: `${Number(sugars.toFixed(1))} g per 100 ${isBeverage ? 'ml' : 'g'}`,
      points: sugarsPts,
    },
    {
      label: 'satFat',
      name: 'High saturated fat',
      value: `${Number(satFat.toFixed(1))} g per 100 g`,
      points: satFatPts,
    },
    {
      label: 'sodiumMg',
      name: 'High sodium',
      value: `${Number(sodiumMg.toFixed(1))} mg per 100 g`,
      points: sodiumPts,
    },
  ];

  negativeContributors.sort((a, b) => b.points - a.points);
  const topNegative = negativeContributors
    .filter((item) => item.points > 0)
    .slice(0, 3)
    .map(
      (item) =>
        `${item.name}: ${item.value} (+${item.points} point${item.points > 1 ? 's' : ''})`,
    );

  const positiveContributors: string[] = [];
  if (fibrePts > 0) {
    positiveContributors.push(
      `Fibre: ${Number(fibre.toFixed(1))} g per 100 g (-${fibrePts} point${fibrePts > 1 ? 's' : ''})`,
    );
  }
  if (proteinPts > 0 && proteinCounted) {
    positiveContributors.push(
      `Protein: ${Number(protein.toFixed(1))} g per 100 g (-${proteinPts} point${proteinPts > 1 ? 's' : ''})`,
    );
  } else if (proteinPts > 0 && !proteinCounted) {
    positiveContributors.push(
      `Protein: ${Number(protein.toFixed(1))} g per 100 g (excluded: high negative points rule)`,
    );
  }
  if (fruitVegPts > 0) {
    positiveContributors.push(
      `Fruits/Vegetables: ${Number(fruitVegPct.toFixed(1))}% (-${fruitVegPts} point${fruitVegPts > 1 ? 's' : ''})`,
    );
  }

  // Add explicit high sugar penalty explanation if applicable
  const reasons = [...topNegative, ...positiveContributors];
  if (isBeverage && sugars >= 7) {
    reasons.unshift(
      `High sugar penalty: ${Number(sugars.toFixed(1))} g/100 ml liquid sugar exceeds daily healthy limits (Grade ${grade})`,
    );
  } else if (!isBeverage && sugars >= 15) {
    reasons.unshift(
      `High sugar penalty: ${Number(sugars.toFixed(1))} g/100 g exceeds FSSAI threshold (Grade ${grade})`,
    );
  }

  return {
    score,
    grade,
    negativePoints: N,
    positivePoints: fibrePts + (proteinCounted ? proteinPts : 0) + fruitVegPts,
    reasons,
    dataQuality,
    methodNote: METHOD_NOTE,
  };
}

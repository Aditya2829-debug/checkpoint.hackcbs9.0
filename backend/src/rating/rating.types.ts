export type Grade = 'A' | 'B' | 'C' | 'D' | 'E';
export type PalmOilResult = 'yes' | 'possible' | 'no';
export type DataQuality = 'complete' | 'partial';
export type ProductCategory = 'food' | 'period' | 'pregnancy';

export interface NutriScoreInput {
  energyKj?: number;
  sugars?: number;
  satFat?: number;
  sodiumMg?: number;
  fibre?: number;
  protein?: number;
  fruitVegPct?: number;
  isBeverage?: boolean;
}

export interface NutriScoreBreakdown {
  energyPoints: number;
  sugarsPoints: number;
  satFatPoints: number;
  sodiumPoints: number;
  fibrePoints: number;
  proteinPoints: number;
  fruitVegPoints: number;
  negativePoints: number;
  positivePoints: number;
}

export interface NutriScoreResult {
  score: number;
  grade: Grade;
  negativePoints: number;
  positivePoints: number;
  reasons: string[];
  dataQuality: DataQuality;
  methodNote: string;
}

export interface AdditivesResult {
  count: number;
  codes: string[];
}

export interface RatingProductInput {
  category: ProductCategory;
  name?: string | null;
  isBeverage?: boolean;
  nutrition?: NutriScoreInput;
  ingredients: string[];
  ingredientsText?: string;
  tags?: string[];
}

export interface RatingResult {
  grade: Grade | null;
  score: number | null;
  reasons: string[];
  warnings: string[];
  palmOil: PalmOilResult;
  additives: AdditivesResult;
  dataQuality: DataQuality;
  methodNote: string;
}

export interface GeminiExtractInput {
  barcode?: string;
  imageBase64?: string;
  mimeType?: string;
  categoryHint?: 'food' | 'period' | 'pregnancy';
}

export interface NutritionPer100g {
  energyKj: number | null;
  energyKcal: number | null;
  sugars: number | null;
  carbs: number | null;
  satFat: number | null;
  salt: number | null;
  sodiumMg: number | null;
  fibre: number | null;
  protein: number | null;
  fruitVegPct: number | null;
}

export interface LabelExtractionResult {
  productName: string | null;
  brand: string | null;
  category: 'food' | 'period' | 'pregnancy' | 'unknown';
  per100g: NutritionPer100g;
  servingSizeG: number | null;
  ingredients: string[];
  ingredientsText: string;
  palmDerivedIngredients: string[];
  fssaiLicense: string | null;
  confidence: number;
  notes: string | null;
}

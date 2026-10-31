export type HealthGrade = 'A' | 'B' | 'C' | 'D';
export type ProductCategory = 'food' | 'women-hygiene' | 'personal-care';

export interface Ingredient {
  id: string;
  name: string;
  insNumber?: string;
  purpose: string;
  riskLevel: 'safe' | 'moderate' | 'high' | 'prohibited';
  regulatoryStatusIndia: string; // e.g. "Permitted by FSSAI under 100ppm" or "IS 5405:2019"
  scientificContext: string;
  isAllergen?: boolean;
}

export interface NutritionFact {
  nutrient: string;
  amountPer100g: string;
  dailyValuePercentage?: string;
  flag?: 'low' | 'moderate' | 'excessive';
}

export interface WomenHygieneSafetyMetrics {
  coreMaterial: string;
  bleachingProcess: 'Elemental Chlorine Free' | 'Total Chlorine Free (TCF)' | 'Chlorine Bleached';
  dioxinRisk: 'Undetectable (<0.01ppt)' | 'Low' | 'High Concern';
  fragranceStatus: 'Unscented / Hypoallergenic' | 'Synthetic Fragrance' | 'Essential Oils Added';
  plasticContentPercentage: number;
  absorbencyTested: string;
  skinIrritationIndex: 'Dermatologically Approved' | 'Mild Irritant' | 'Hypoallergenic';
  bisStandardCompliance: string; // e.g., "IS 5405:2019 Certified"
}

export interface RegulatoryNotice {
  authority: 'FSSAI' | 'CDSCO' | 'BIS' | 'WHO';
  standardCode: string;
  status: 'Compliant' | 'Warning' | 'Pending Review' | 'Violation';
  summary: string;
  sourceUrl?: string;
}

export interface ScientificStudy {
  id: string;
  title: string;
  journal: string;
  year: number;
  doi?: string;
  findingSummary: string;
}

export interface GeminiExplainer {
  theBigPicture: string;
  whyThisGrade: string[];
  safeAlternativesSuggested?: string[];
  suggestedQuestions: string[];
}

export interface Product {
  id: string;
  barcode: string;
  name: string;
  brand: string;
  category: ProductCategory;
  categoryLabel: string;
  imageUrl: string;
  packSize: string;
  grade: HealthGrade;
  gradeScore: number; // 0 - 100
  summary: string;
  ingredients: Ingredient[];
  nutritionFacts?: NutritionFact[];
  hygieneMetrics?: WomenHygieneSafetyMetrics;
  regulatoryNotices: RegulatoryNotice[];
  scientificEvidence: ScientificStudy[];
  geminiExplainer: GeminiExplainer;
  scannedAt?: string;
  isFavorite?: boolean;
}

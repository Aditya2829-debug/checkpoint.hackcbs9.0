import { RatingResult } from '../rating/rating.types';
import { LabelExtractionResult } from '../gemini/gemini.types';

export type ScanStatus = 'OK' | 'NOT_FOUND' | 'NEEDS_RETAKE';
export type ScanSource = 'database' | 'cache' | 'gemini' | null;

export interface ScannedProduct {
  barcode: string;
  name: string | null;
  brand: string | null;
  category: string;
  nutrition: Record<string, any> | null;
  ingredients: string[];
  fssaiLicense?: string | null;
}

export interface ScanResponse {
  status: ScanStatus;
  source: ScanSource;
  needsLabelPhoto?: boolean;
  reason?: string;
  product?: ScannedProduct;
  rating?: RatingResult;
}

export interface ScanCacheDocument {
  barcode: string;
  extraction: LabelExtractionResult;
  category: string;
  createdAt: Date;
  source: 'gemini';
}

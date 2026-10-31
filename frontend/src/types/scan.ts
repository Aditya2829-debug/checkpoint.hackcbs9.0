export type ScanMode = 'barcode' | 'ocr';

export interface ExtractedOcrField {
  fieldName: string;
  extractedValue: string;
  confidenceScore: number; // 0 - 1
  isVerified: boolean;
}

export interface OcrExtractionResult {
  rawText: string;
  productNameCandidates: string[];
  brandCandidate?: string;
  extractedIngredients: string[];
  nutritionalTokens: { key: string; value: string }[];
  detectedStandardCodes: string[];
}

export interface ScanSession {
  mode: ScanMode;
  scannedCode?: string;
  capturedImageUrl?: string;
  status: 'idle' | 'scanning' | 'processing' | 'verifying' | 'success' | 'error';
  errorMessage?: string;
}

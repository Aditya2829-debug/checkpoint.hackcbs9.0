import { create } from 'zustand';
import type { ScanMode } from '../types';

interface ScanStoreState {
  isScannerOpen: boolean;
  activeMode: ScanMode;
  torchOn: boolean;
  manualBarcodeInput: string;
  capturedImage: string | null;
  extractedIngredients: string[];
  productNameDraft: string;
  categoryDraft: 'food' | 'women-hygiene';
  isExtracting: boolean;
  scanHistoryIds: string[];

  // Actions
  openScanner: (mode?: ScanMode) => void;
  closeScanner: () => void;
  setActiveMode: (mode: ScanMode) => void;
  toggleTorch: () => void;
  setManualBarcodeInput: (code: string) => void;
  setCapturedImage: (img: string | null) => void;
  setExtractedIngredients: (ings: string[]) => void;
  addExtractedIngredient: (ing: string) => void;
  removeExtractedIngredient: (index: number) => void;
  setProductNameDraft: (name: string) => void;
  setCategoryDraft: (cat: 'food' | 'women-hygiene') => void;
  setIsExtracting: (val: boolean) => void;
  recordScan: (productId: string) => void;
}

export const useScanStore = create<ScanStoreState>((set) => ({
  isScannerOpen: false,
  activeMode: 'barcode',
  torchOn: false,
  manualBarcodeInput: '',
  capturedImage: null,
  extractedIngredients: [],
  productNameDraft: '',
  categoryDraft: 'food',
  isExtracting: false,
  scanHistoryIds: ['prod-maggi-01', 'prod-carmesi-pads-03', 'prod-tata-dal-02'],

  openScanner: (mode = 'barcode') =>
    set({
      isScannerOpen: true,
      activeMode: mode,
      manualBarcodeInput: '',
      capturedImage: null,
      extractedIngredients: [],
    }),

  closeScanner: () =>
    set({
      isScannerOpen: false,
      torchOn: false,
    }),

  setActiveMode: (mode) => set({ activeMode: mode }),

  toggleTorch: () => set((s) => ({ torchOn: !s.torchOn })),

  setManualBarcodeInput: (code) => set({ manualBarcodeInput: code }),

  setCapturedImage: (img) => set({ capturedImage: img }),

  setExtractedIngredients: (ings) => set({ extractedIngredients: ings }),

  addExtractedIngredient: (ing) =>
    set((s) => ({ extractedIngredients: [...s.extractedIngredients, ing] })),

  removeExtractedIngredient: (idx) =>
    set((s) => ({
      extractedIngredients: s.extractedIngredients.filter((_, i) => i !== idx),
    })),

  setProductNameDraft: (name) => set({ productNameDraft: name }),

  setCategoryDraft: (cat) => set({ categoryDraft: cat }),

  setIsExtracting: (val) => set({ isExtracting: val }),

  recordScan: (productId) =>
    set((s) => ({
      scanHistoryIds: [productId, ...s.scanHistoryIds.filter((id) => id !== productId)],
    })),
}));

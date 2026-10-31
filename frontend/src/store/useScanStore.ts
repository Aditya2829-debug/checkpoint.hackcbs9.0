import { create } from 'zustand';
import type { ScanMode, Product } from '../types';

export interface HistoryItem {
  id: string;
  name: string;
  brand: string;
  category: string;
  categoryLabel?: string;
  barcode?: string;
  grade: 'A' | 'B' | 'C' | 'D' | 'E';
  gradeScore: number;
  imageUrl: string;
  summary: string;
  scannedAt: number; // timestamp
  source: 'barcode' | 'search' | 'ocr';
}

const STORAGE_KEY = 'checkpoint_scan_history_v2';

// Load persisted history from localStorage or fallback to default curated items
const loadInitialHistory = (): HistoryItem[] => {
  try {
    const raw = localStorage.getItem(STORAGE_KEY);
    if (raw) {
      const parsed = JSON.parse(raw);
      if (Array.isArray(parsed) && parsed.length > 0) {
        return parsed;
      }
    }
  } catch {
    // Ignore storage parse error
  }

  // Initial curated samples so history is never blank on fresh launch
  return [
    {
      id: 'prod-hide-seek-05',
      name: 'HIDE & SEEK® Chocolate Chip Cookies',
      brand: 'PARLE',
      category: 'food',
      categoryLabel: 'Cookies & Biscuits',
      barcode: '8901719114251',
      grade: 'E',
      gradeScore: 18,
      imageUrl: 'https://images.unsplash.com/photo-1499636136210-6f4ee915583e?auto=format&fit=crop&w=600&q=80',
      summary: 'High sugar (32.5g) & refined palm oil cookies. Disclosed 23% chocolate with raising agents.',
      scannedAt: Date.now() - 1000 * 60 * 12, // 12 mins ago
      source: 'barcode',
    },
    {
      id: 'prod-maggi-04',
      name: '2-Minute Masala Noodles',
      brand: 'Maggi',
      category: 'food',
      categoryLabel: 'Instant Noodles',
      barcode: '8901058852341',
      grade: 'D',
      gradeScore: 28,
      imageUrl: 'https://images.unsplash.com/photo-1612927601601-6638404737ce?auto=format&fit=crop&w=600&q=80',
      summary: 'Deep-fried in palm oil with excessive sodium (1020mg/100g).',
      scannedAt: Date.now() - 1000 * 60 * 65, // ~1 hour ago
      source: 'search',
    },
    {
      id: 'prod-puresoft-hygiene-02',
      name: 'PureSoft Organic Cotton Ultra Thin Pads',
      brand: 'PureSoft',
      category: 'women-hygiene',
      categoryLabel: 'Sanitary Pads',
      barcode: '8906105820019',
      grade: 'A',
      gradeScore: 98,
      imageUrl: 'https://images.unsplash.com/photo-1584308666744-24d5c474f2ae?auto=format&fit=crop&w=600&q=80',
      summary: '100% GOTS organic cotton, chlorine-free (TCF), zero perfumes.',
      scannedAt: Date.now() - 1000 * 60 * 180, // 3 hours ago
      source: 'ocr',
    },
  ];
};

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
  historyItems: HistoryItem[];

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
  recordProductActivity: (product: Product, source?: 'barcode' | 'search' | 'ocr') => void;
  removeFromHistory: (id: string) => void;
  clearHistory: () => void;
}

export const useScanStore = create<ScanStoreState>((set, get) => {
  const initialHistory = loadInitialHistory();

  return {
    isScannerOpen: false,
    activeMode: 'barcode',
    torchOn: false,
    manualBarcodeInput: '',
    capturedImage: null,
    extractedIngredients: [],
    productNameDraft: '',
    categoryDraft: 'food',
    isExtracting: false,
    scanHistoryIds: initialHistory.map((h) => h.id),
    historyItems: initialHistory,

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
      set((s) => {
        const updatedIds = [productId, ...s.scanHistoryIds.filter((id) => id !== productId)];
        return { scanHistoryIds: updatedIds };
      }),

    recordProductActivity: (product: Product, source: 'barcode' | 'search' | 'ocr' = 'barcode') => {
      const current = get().historyItems;
      const newEntry: HistoryItem = {
        id: product.id,
        name: product.name,
        brand: product.brand,
        category: product.category,
        categoryLabel: product.categoryLabel,
        barcode: product.barcode,
        grade: product.grade,
        gradeScore: product.gradeScore,
        imageUrl: product.imageUrl,
        summary: product.summary,
        scannedAt: Date.now(),
        source,
      };

      // Filter out previous entry of the same product and prepend new one
      const updated = [newEntry, ...current.filter((item) => item.id !== product.id && item.barcode !== product.barcode)].slice(0, 50);

      try {
        localStorage.setItem(STORAGE_KEY, JSON.stringify(updated));
      } catch {
        // Storage limit protection
      }

      set({
        historyItems: updated,
        scanHistoryIds: updated.map((i) => i.id),
      });
    },

    removeFromHistory: (id: string) => {
      const current = get().historyItems;
      const updated = current.filter((item) => item.id !== id && item.barcode !== id);
      try {
        localStorage.setItem(STORAGE_KEY, JSON.stringify(updated));
      } catch {}
      set({
        historyItems: updated,
        scanHistoryIds: updated.map((i) => i.id),
      });
    },

    clearHistory: () => {
      try {
        localStorage.removeItem(STORAGE_KEY);
      } catch {}
      set({ historyItems: [], scanHistoryIds: [] });
    },
  };
});

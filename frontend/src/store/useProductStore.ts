import { create } from 'zustand';
import type { Product } from '../types';
import { MOCK_PRODUCTS } from '../services/api/mockData';

interface ProductStoreState {
  currentProduct: Product | null;
  products: Product[];
  watchlistIds: string[];
  searchQuery: string;
  selectedCategory: string;

  // Actions
  setCurrentProduct: (product: Product | null) => void;
  setProducts: (products: Product[]) => void;
  addProduct: (product: Product) => void;
  toggleWatchlist: (productId: string) => void;
  isWatchlisted: (productId: string) => boolean;
  setSearchQuery: (query: string) => void;
  setSelectedCategory: (category: string) => void;
}

export const useProductStore = create<ProductStoreState>((set, get) => ({
  currentProduct: MOCK_PRODUCTS[0],
  products: MOCK_PRODUCTS,
  watchlistIds: ['prod-carmesi-pads-03', 'prod-tata-dal-02'],
  searchQuery: '',
  selectedCategory: 'all',

  setCurrentProduct: (product) => set({ currentProduct: product }),

  setProducts: (products) => set({ products }),

  addProduct: (product) =>
    set((state) => {
      if (state.products.some((p) => p.id === product.id || (p.barcode && p.barcode === product.barcode))) {
        return state;
      }
      return { products: [product, ...state.products] };
    }),

  toggleWatchlist: (productId) =>
    set((state) => {
      const exists = state.watchlistIds.includes(productId);
      const updated = exists
        ? state.watchlistIds.filter((id) => id !== productId)
        : [...state.watchlistIds, productId];
      return { watchlistIds: updated };
    }),

  isWatchlisted: (productId) => get().watchlistIds.includes(productId),

  setSearchQuery: (searchQuery) => set({ searchQuery }),

  setSelectedCategory: (selectedCategory) => set({ selectedCategory }),
}));

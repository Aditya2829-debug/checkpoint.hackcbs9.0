import { apiClient } from './apiClient';
import { ENDPOINTS } from './endpoints';
import { MOCK_PRODUCTS } from './mockData';
import type { Product } from '../../types';

export const productService = {
  /**
   * Get product by barcode
   */
  async getByBarcode(barcode: string): Promise<Product> {
    try {
      const response = await apiClient.get<Product>(ENDPOINTS.PRODUCTS.BY_BARCODE(barcode));
      return response.data;
    } catch {
      // Fallback to local data for offline/standalone frontend execution
      const found = MOCK_PRODUCTS.find((p) => p.barcode === barcode);
      if (found) {
        return found;
      }
      // If barcode isn't in mock data, return the first one with updated barcode
      return {
        ...MOCK_PRODUCTS[0],
        barcode,
        name: `Scanned Product #${barcode.slice(-4)}`,
      };
    }
  },

  /**
   * Get product by ID
   */
  async getById(id: string): Promise<Product> {
    try {
      const response = await apiClient.get<Product>(ENDPOINTS.PRODUCTS.BY_ID(id));
      return response.data;
    } catch {
      const found = MOCK_PRODUCTS.find((p) => p.id === id);
      if (found) return found;
      return MOCK_PRODUCTS[0];
    }
  },

  /**
   * Search products by keyword or category
   */
  async search(query: string, category?: string): Promise<Product[]> {
    try {
      const response = await apiClient.get<Product[]>(ENDPOINTS.PRODUCTS.SEARCH, {
        params: { q: query, category },
      });
      return response.data;
    } catch {
      let filtered = [...MOCK_PRODUCTS];
      if (query.trim()) {
        const q = query.toLowerCase();
        filtered = filtered.filter(
          (p) =>
            p.name.toLowerCase().includes(q) ||
            p.brand.toLowerCase().includes(q) ||
            p.barcode.includes(q)
        );
      }
      if (category && category !== 'all') {
        filtered = filtered.filter((p) => p.category === category);
      }
      return filtered;
    }
  },

  /**
   * Get all available sample products
   */
  async getAll(): Promise<Product[]> {
    return MOCK_PRODUCTS;
  },
};

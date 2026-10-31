import { apiClient } from './apiClient';
import { ENDPOINTS } from './endpoints';
import { MOCK_PRODUCTS } from './mockData';
import type { OcrExtractionResult, Product } from '../../types';

export const scanService = {
  /**
   * Barcode lookup
   */
  async lookupBarcode(barcode: string): Promise<Product> {
    try {
      const response = await apiClient.post<Product>(ENDPOINTS.SCANNING.BARCODE_LOOKUP, { barcode });
      return response.data;
    } catch {
      const found = MOCK_PRODUCTS.find((p) => p.barcode === barcode);
      return found || MOCK_PRODUCTS[0];
    }
  },

  /**
   * OCR ingredient label extraction
   */
  async extractFromImage(imageFileOrBase64: string | File): Promise<OcrExtractionResult> {
    try {
      const formData = new FormData();
      if (typeof imageFileOrBase64 === 'string') {
        formData.append('image_base64', imageFileOrBase64);
      } else {
        formData.append('image_file', imageFileOrBase64);
      }
      const response = await apiClient.post<OcrExtractionResult>(ENDPOINTS.SCANNING.OCR_EXTRACT, formData, {
        headers: { 'Content-Type': 'multipart/form-data' },
      });
      return response.data;
    } catch {
      // Realistic simulated OCR extraction for development/offline test
      return {
        rawText: 'INGREDIENTS: REFINED WHEAT FLOUR (MAIDA), PALM OIL, IODIZED SALT, HYDROLYZED PEANUT PROTEIN, SUGAR, FLAVOR ENHANCER (INS 635), ACIDITY REGULATOR (INS 501(i)). CONTAINS ADDED FLAVOR.',
        productNameCandidates: ['2-Minute Masala Noodles', 'Masala Instant Noodles'],
        brandCandidate: 'Maggi',
        extractedIngredients: [
          'Refined Wheat Flour (Maida)',
          'Palm Oil',
          'Iodized Salt',
          'Hydrolyzed Peanut Protein',
          'Sugar',
          'INS 635 (Disodium ribonucleotides)',
          'INS 501(i) (Potassium Carbonate)',
        ],
        nutritionalTokens: [
          { key: 'Energy', value: '427 kcal' },
          { key: 'Sodium', value: '1020 mg' },
          { key: 'Total Fat', value: '15.7 g' },
        ],
        detectedStandardCodes: ['FSSAI 10012011000168'],
      };
    }
  },

  /**
   * Submit verified OCR fields for backend grading & analysis
   */
  async analyzeVerifiedOcr(data: {
    productName: string;
    brand?: string;
    category: 'food' | 'women-hygiene';
    ingredients: string[];
  }): Promise<Product> {
    try {
      const response = await apiClient.post<Product>(ENDPOINTS.SCANNING.OCR_SUBMIT, data);
      return response.data;
    } catch {
      if (data.category === 'women-hygiene') {
        return MOCK_PRODUCTS[2]; // Carmesi or Whisper
      }
      return MOCK_PRODUCTS[0]; // Maggi
    }
  },
};

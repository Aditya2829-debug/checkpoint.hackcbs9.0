/**
 * CheckPoint!! API Endpoints
 * All endpoints adhere to backend service architecture.
 */

export const API_BASE_URL = import.meta.env.VITE_API_URL || 'http://localhost:8000/api/v1';

export const ENDPOINTS = {
  // Auth & User Profile
  AUTH: {
    LOGIN: '/auth/login',
    REGISTER: '/auth/register',
    REFRESH: '/auth/refresh',
    ME: '/users/me',
    PREFERENCES: '/users/me/preferences',
  },
  // Products & Scanning
  PRODUCTS: {
    BY_BARCODE: (barcode: string) => `/products/barcode/${barcode}`,
    BY_ID: (id: string) => `/products/${id}`,
    SEARCH: '/products/search',
    CATEGORIES: '/products/categories',
  },
  SCANNING: {
    BARCODE_LOOKUP: (barcode: string) => `/scan/${barcode}`,
    LABEL_ANALYZE: '/scan/label',
    OCR_EXTRACT: '/scanning/ocr/extract',
    OCR_SUBMIT: '/scanning/ocr/analyze',
  },
  INGREDIENTS: {
    BY_ID: (id: string) => `/ingredients/${id}`,
    CHECK_ALLERGENS: '/ingredients/check-allergens',
  },
  EVIDENCE: {
    BY_PRODUCT: (productId: string) => `/evidence/product/${productId}`,
  },
  REGULATIONS: {
    BY_PRODUCT: (productId: string) => `/regulations/product/${productId}`,
    FSSAI_STANDARDS: '/regulations/fssai',
    BIS_STANDARDS: '/regulations/bis',
  },
  RATINGS: {
    SUBMIT: '/ratings',
    SUMMARY: (productId: string) => `/ratings/product/${productId}`,
  },
  FEEDBACK: {
    SUBMIT: '/feedback',
  },
  AI: {
    EXPLAIN: (productId: string) => `/ai/explain/${productId}`,
    ASK: '/ai/chat',
  },
} as const;

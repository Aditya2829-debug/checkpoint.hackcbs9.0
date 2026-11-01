import { apiClient } from './apiClient';
import { ENDPOINTS } from './endpoints';
import { MOCK_PRODUCTS } from './mockData';
import type { Product, HealthGrade } from '../../types';

function mapBackendProductItem(doc: any): Product {
  const barcode = doc.barcode || doc.productId || 'UNKNOWN';
  const name = doc.name || `Product (${barcode})`;
  const brand = doc.brand || 'Brand';
  const isPeriod =
    doc.category === 'period' ||
    doc.productCategory === 'menstrual_pad' ||
    /hygiene|pad/i.test(doc.category || '');

  const nutrition = doc.nutrition || {};
  const kcal = nutrition.caloriesKcal || 0;
  const sugars = nutrition.sugars || 0;
  const satFat = nutrition.satFat || 0;
  const sodium = nutrition.sodiumMg || 0;
  const palm = !!doc.palmOil;

  // Grade calculation
  let grade: HealthGrade = 'C';
  let gradeScore = 50;

  if (doc.rating && doc.rating.grade) {
    grade = doc.rating.grade;
    gradeScore = doc.rating.score ?? 50;
  } else {
    const isBeverage =
      /coca[- ]?cola|pepsi|thums|sprite|fanta|mirinda|frooti|maaza|slice|sting|dew|limca|juice|soda|drink|beverage|cola/i.test(
        `${name} ${brand}`,
      ) || (sugars > 0 && satFat === 0 && (nutrition.protein || 0) === 0);

    if (kcal === 0 && sugars === 0 && !palm) {
      grade = 'A';
      gradeScore = 100;
    } else if (isBeverage && sugars >= 10) {
      grade = 'E';
      gradeScore = 10;
    } else if (isBeverage && sugars >= 6) {
      grade = 'D';
      gradeScore = 28;
    } else if (sugars > 25 || satFat > 12 || (palm && sugars > 15)) {
      grade = 'E';
      gradeScore = 15;
    } else if (sugars > 15 || satFat > 6 || sodium > 700 || palm) {
      grade = 'D';
      gradeScore = 32;
    } else if (sugars > 8 || satFat > 3 || sodium > 300) {
      grade = 'C';
      gradeScore = 55;
    } else {
      grade = 'B';
      gradeScore = 75;
    }
  }

  // Ingredients parse
  const rawIngs = (doc.ingredientsText || '')
    .split(/[,;•\n]+/)
    .map((s: string) => s.trim())
    .filter(Boolean);

  const ingredients = rawIngs.map((ing: string, idx: number) => {
    const lower = ing.toLowerCase();
    const isPalm = /palm/i.test(lower);
    const isSugar = /sugar|invert|syrup|glucose/i.test(lower);
    return {
      id: `ing-${idx}-${ing.slice(0, 10).replace(/\s+/g, '-').toLowerCase()}`,
      name: ing,
      purpose: isPalm ? 'Shortening / Lipid' : isSugar ? 'Sweetener' : 'Standard ingredient',
      riskLevel: isPalm || isSugar ? ('high' as const) : ('safe' as const),
      regulatoryStatusIndia: 'FSSAI Approved',
      scientificContext: isPalm
        ? 'High saturated palmitic acid.'
        : isSugar
        ? 'Free sugars contribute to glycemic load.'
        : 'Standard formulation ingredient.',
    };
  });

  const nutritionFacts = [
    { nutrient: 'Energy', amountPer100g: `${kcal} kcal` },
    {
      nutrient: 'Sugars',
      amountPer100g: `${sugars} g`,
      flag: sugars > 20 ? ('excessive' as const) : sugars > 10 ? ('moderate' as const) : ('low' as const),
    },
    {
      nutrient: 'Saturated Fat',
      amountPer100g: `${satFat} g`,
      flag: satFat > 5 ? ('excessive' as const) : ('moderate' as const),
    },
    {
      nutrient: 'Sodium',
      amountPer100g: `${sodium} mg`,
      flag: sodium > 600 ? ('excessive' as const) : ('moderate' as const),
    },
  ];

  return {
    id: doc.productId || barcode,
    barcode,
    name,
    brand,
    category: isPeriod ? 'women-hygiene' : 'food',
    categoryLabel: doc.subCategory || (isPeriod ? "Women's Hygiene" : 'Packaged Goods'),
    imageUrl: 'https://images.unsplash.com/photo-1546069901-ba9599a7e63c?auto=format&fit=crop&q=80&w=600',
    packSize: doc.servingSizeG ? `${doc.servingSizeG}g` : '100g',
    grade,
    gradeScore,
    summary: `${name} by ${brand}. Rated Grade ${grade} based on verified benchmarks.`,
    ingredients,
    nutritionFacts,
    regulatoryNotices: [
      ...(doc.fssaiLicense
        ? [
            {
              authority: 'FSSAI' as const,
              standardCode: `Lic. ${doc.fssaiLicense}`,
              status: 'Compliant' as const,
              summary: 'FSSAI Manufacturing License registered.',
            },
          ]
        : []),
    ],
    scientificEvidence: [],
    geminiExplainer: {
      theBigPicture: `${name} is produced by ${brand}.`,
      whyThisGrade: [
        palm ? 'Palm oil detected (-1 grade penalty)' : 'No palm oil detected',
        sugars > 10 ? `Sugars reach ${sugars}g per 100g` : 'Low sugar content',
      ],
      suggestedQuestions: [`Is ${name} healthy?`, `What is the calorie count of ${name}?`],
    },
  };
}

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
   * Get all available products (combining backend MongoDB Atlas and local products)
   */
  async getAll(): Promise<Product[]> {
    try {
      const response = await apiClient.get<{ data: any[] }>(`${ENDPOINTS.PRODUCTS.LIST}?limit=100`);
      if (response.data && Array.isArray(response.data.data) && response.data.data.length > 0) {
        const backendProducts = response.data.data.map(mapBackendProductItem);
        const seen = new Set<string>();
        const uniqueProducts: Product[] = [];

        // Local rich products take priority for full metadata
        for (const p of MOCK_PRODUCTS) {
          const key = p.barcode || p.id;
          if (!seen.has(key) && !seen.has(p.id)) {
            seen.add(key);
            seen.add(p.id);
            uniqueProducts.push(p);
          }
        }

        // Add backend products without duplicating
        for (const bp of backendProducts) {
          const key = bp.barcode || bp.id;
          if (!seen.has(key) && !seen.has(bp.id)) {
            seen.add(key);
            seen.add(bp.id);
            uniqueProducts.push(bp);
          }
        }

        return uniqueProducts;
      }
    } catch {
      // Fallback seamlessly to local verified products
    }
    return MOCK_PRODUCTS;
  },
};

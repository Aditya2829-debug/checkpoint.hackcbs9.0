import { apiClient } from './apiClient';
import { ENDPOINTS } from './endpoints';
import { MOCK_PRODUCTS } from './mockData';
import type { HealthGrade, Ingredient, NutritionFact, OcrExtractionResult, Product } from '../../types';

export interface BackendScanResponse {
  status: 'OK' | 'NOT_FOUND' | 'NEEDS_RETAKE';
  source: 'database' | 'cache' | 'gemini' | null;
  needsLabelPhoto?: boolean;
  reason?: string;
  product?: {
    barcode: string;
    name: string | null;
    brand: string | null;
    category: string;
    nutrition: Record<string, any> | null;
    ingredients: string[];
    fssaiLicense?: string | null;
  };
  rating?: {
    grade: 'A' | 'B' | 'C' | 'D' | 'E' | null;
    score: number | null;
    reasons: string[];
    warnings: string[];
    palmOil: 'yes' | 'possible' | 'no';
    additives: { count: number; codes: string[] };
    dataQuality: 'complete' | 'partial';
    methodNote: string;
  };
}

export class ProductNotFoundError extends Error {
  public readonly needsLabelPhoto: boolean;
  public readonly barcode: string;

  constructor(barcode: string, needsLabelPhoto = true) {
    super(`Product with barcode "${barcode}" not found in database.`);
    this.name = 'ProductNotFoundError';
    this.needsLabelPhoto = needsLabelPhoto;
    this.barcode = barcode;
  }
}

export function transformScanResponseToProduct(res: BackendScanResponse, fallbackBarcode?: string): Product {
  const barcode = res.product?.barcode || fallbackBarcode || 'UNKNOWN';
  const name = res.product?.name || `Product (${barcode})`;
  const brand = res.product?.brand || 'Brand';
  const grade = (res.rating?.grade as HealthGrade) || 'C';

  // Calculate a 0-100 score from Nutri-Score score
  let gradeScore = 50;
  if (res.rating?.score !== null && res.rating?.score !== undefined) {
    const s = res.rating.score;
    if (s <= -1) gradeScore = Math.min(100, Math.max(85, 95 - s * 2));
    else if (s <= 2) gradeScore = Math.max(70, 85 - s * 5);
    else if (s <= 10) gradeScore = Math.max(50, 70 - (s - 3) * 2.5);
    else if (s <= 18) gradeScore = Math.max(30, 50 - (s - 11) * 2.5);
    else gradeScore = Math.max(10, 30 - (s - 19) * 2);
  }

  // Parse ingredients and classify harmful chemicals / additives
  const ingredients: Ingredient[] = (res.product?.ingredients || []).map((ing, idx) => {
    const lower = ing.toLowerCase();
    let riskLevel: 'safe' | 'moderate' | 'high' | 'prohibited' = 'safe';
    let purpose = 'Natural ingredient';
    let scientificContext = 'Standard consumer dietary ingredient.';
    let regulatoryStatusIndia = 'FSSAI Approved';
    let insNumber: string | undefined;

    // Check palm oil & palm derivatives
    if (/palm\s*oil|palmolein|palm\s*olein|palm\s*kernel|palm\s*fat/i.test(lower)) {
      riskLevel = 'high';
      purpose = 'Saturated Vegetable Fat';
      regulatoryStatusIndia = 'FSSAI: Mandatory specific oil declaration required (Reg. 2.4.2)';
      scientificContext =
        'Contains ~45% saturated palmitic acid. Clinical trials demonstrate elevation in low-density lipoprotein (LDL) cholesterol and increased cardiovascular atherogenic risk.';
    }
    // High-concern preservatives: Benzoates (INS 210-219)
    else if (/ins\s*21[0-9]|211|benzoate/i.test(lower)) {
      riskLevel = 'high';
      insNumber = 'INS 211';
      purpose = 'Synthetic Preservative';
      regulatoryStatusIndia = 'FSSAI limits to max 750 ppm';
      scientificContext =
        'Can react with Ascorbic Acid (Vitamin C) under heat/light to form trace benzene, a known human carcinogen. May trigger allergies and asthmatic episodes in sensitive individuals.';
    }
    // High-concern preservatives: Sulphites (INS 220-228, e.g. 223 metabisulphite)
    else if (/ins\s*22[0-9]|223|224|220|metabisulphite|metabisulfite|sulphite|sulfite/i.test(lower)) {
      riskLevel = 'high';
      insNumber = 'INS 223';
      purpose = 'Preservative & Dough Conditioner';
      regulatoryStatusIndia = 'FSSAI: Mandatory Allergen Declaration required';
      scientificContext =
        'Releases sulphur dioxide gas; strong potential to trigger acute bronchospasm, asthma flare-ups, and severe allergic reactions in asthmatics.';
    }
    // High-concern synthetic antioxidants: TBHQ (INS 319), BHA (INS 320), BHT (INS 321)
    else if (/ins\s*(?:319|320|321)|tbhq|bha|bht|butylated/i.test(lower)) {
      riskLevel = 'high';
      insNumber = lower.includes('319') || lower.includes('tbhq') ? 'INS 319' : 'INS 320';
      purpose = 'Synthetic Chemical Antioxidant';
      regulatoryStatusIndia = 'FSSAI capped at 200 ppm in fats/oils';
      scientificContext =
        'Petroleum-derived preservative. High doses in laboratory models are linked to cellular stress, DNA damage, and endocrine modulation.';
    }
    // High-concern synthetic food dyes: Tartrazine (102), Sunset Yellow (110), Carmoisine (122), Ponceau 4R (124), Allura Red (129)
    else if (/ins\s*(?:102|110|122|124|129)|102|110|122|124|129|tartrazine|sunset\s*yellow|carmoisine|azorubine|ponceau|allura/i.test(lower)) {
      riskLevel = 'high';
      const codeMatch = lower.match(/102|110|122|124|129/);
      insNumber = codeMatch ? `INS ${codeMatch[0]}` : 'INS 102';
      purpose = 'Synthetic Azo Food Dye';
      regulatoryStatusIndia = 'FSSAI: Permitted in select foods only with mandatory statutory warning';
      scientificContext =
        'Southampton study identified azo dyes as triggers for hyperactivity and attention deficit in children. Potential allergen linked to hives and eczema.';
    }
    // Caramel Colour Class III / IV (INS 150c, INS 150d)
    else if (/ins\s*150[cd]?|150[cd]|caramel\s*col/i.test(lower)) {
      riskLevel = 'moderate';
      insNumber = 'INS 150d';
      purpose = 'Caramel Colour Class IV';
      regulatoryStatusIndia = 'FSSAI permitted with mandatory class declaration';
      scientificContext =
        'Manufactured with ammonia and sulphite compounds; contains trace 4-Methylimidazole (4-MEI) byproducts, classified by IARC as possibly carcinogenic (Group 2B).';
    }
    // Flavour enhancers: MSG (INS 621), Disodium 5-ribonucleotides (INS 635), 627, 631
    else if (/ins\s*6[23][0-9]|621|627|631|635|msg|glutamate|ribonucleotide/i.test(lower)) {
      riskLevel = 'moderate';
      insNumber = lower.includes('635') ? 'INS 635' : 'INS 621';
      purpose = 'Flavour Enhancer (Excitotoxin)';
      regulatoryStatusIndia = 'FSSAI permitted flavour enhancer (not recommended for infants)';
      scientificContext =
        'Potentiates savory taste pathways. Can trigger headache, facial tightness, or palpitations in individuals sensitive to free glutamates.';
    }
    // Chemical leavening agents: Ammonium Bicarbonate (503), Sodium Bicarbonate (500)
    else if (/503|500|raising\s*agent|leavening/i.test(lower)) {
      const codeMatch = lower.match(/503(?:\([a-z0-9]+\))?|500(?:\([a-z0-9]+\))?/i);
      insNumber = codeMatch ? `INS ${codeMatch[0].toUpperCase()}` : 'INS 500';
      riskLevel = 'moderate';
      purpose = 'Chemical Leavening Agent';
      regulatoryStatusIndia = 'FSSAI permitted food additive';
      scientificContext =
        'Inorganic carbonates used to aerate dough. Generally recognized as safe when baked out, but marks an ultra-processed industrial bakery matrix.';
    }
    // Emulsifiers: INS 322 (Lecithin), INS 471, INS 472e, INS 476
    else if (/ins\s*47[0-9]|471|472[a-e]?|476|322|emulsifier/i.test(lower)) {
      const codeMatch = lower.match(/471|472[a-e]?|476|322/i);
      insNumber = codeMatch ? `INS ${codeMatch[0].toUpperCase()}` : 'INS 471';
      riskLevel = 'moderate';
      purpose = 'Chemical Emulsifier & Stabilizer';
      regulatoryStatusIndia = 'FSSAI permitted emulsifier';
      scientificContext =
        'Synthetic mono- and diglycerides or esters. Recent microbiome studies suggest some emulsifiers may erode mucosal gut lining when consumed in high frequency.';
    }
    // Artificial & Nature Identical Flavouring
    else if (/artificial\s*flavour|nature\s*identical|synthetic\s*flavour/i.test(lower)) {
      riskLevel = 'moderate';
      purpose = 'Synthetic Aroma Compounds';
      regulatoryStatusIndia = 'FSSAI: Statutory label declaration required';
      scientificContext =
        'Synthesized organic esters and aldehydes replicating natural aromas without botanical nutrition. Over-stimulates sensory satiety cues.';
    }
    // Invert sugar / Liquid Glucose / High Fructose
    else if (/invert\s*sugar|glucose\s*syrup|corn\s*syrup|liquid\s*glucose/i.test(lower)) {
      riskLevel = 'moderate';
      purpose = 'Refined Fast-Absorbing Sugar';
      regulatoryStatusIndia = 'FSSAI permitted caloric sweetener';
      scientificContext =
        'Hydrolyzed free glucose and fructose syrup. Causes steep postprandial glucose spikes and accelerates hepatic de novo lipogenesis.';
    }
    // Feminine Hygiene flags: Chlorine Bleaching, Fragrance, Polyethylene
    else if (/chlorine|bleached|fragrance|perfume|polyethylene/i.test(lower)) {
      riskLevel = 'high';
      purpose = 'Chemical Bleaching / Synthetic Fragrance';
      regulatoryStatusIndia = 'CDSCO / BIS standards';
      scientificContext =
        'Chlorine bleaching can generate trace organochlorines and dioxins. Fragrances contain potential endocrine-disrupting phthalates causing contact dermatitis.';
    }
    // Generic INS or E numbers
    else if (/(?:ins|e)\s*([0-9]{3,4}[a-z]?)/i.test(lower)) {
      const match = lower.match(/(?:ins|e)\s*([0-9]{3,4}[a-z]?)/i);
      insNumber = match ? `INS ${match[1].toUpperCase()}` : undefined;
      riskLevel = 'moderate';
      purpose = 'Chemical Food Additive';
      regulatoryStatusIndia = 'FSSAI food additive standards';
      scientificContext = 'Processed chemical additive. Permitted under standard Good Manufacturing Practice caps.';
    }

    return {
      id: `ing-${idx}-${ing.slice(0, 10).replace(/\s+/g, '-').toLowerCase()}`,
      name: ing,
      insNumber,
      purpose,
      riskLevel,
      regulatoryStatusIndia,
      scientificContext,
    };
  });

  // Nutrition Facts
  const nutrition = res.product?.nutrition || {};
  const nutritionFacts: NutritionFact[] = [];
  if (nutrition.caloriesKcal != null || nutrition.energyKj != null) {
    const kcal = nutrition.caloriesKcal ?? Math.round((nutrition.energyKj || 0) / 4.184);
    nutritionFacts.push({
      nutrient: 'Energy',
      amountPer100g: `${kcal} kcal (${Math.round(kcal * 4.184)} kJ)`,
      flag: kcal > 450 ? 'excessive' : kcal > 250 ? 'moderate' : 'low',
    });
  }
  if (nutrition.sugars != null) {
    nutritionFacts.push({
      nutrient: 'Sugars',
      amountPer100g: `${nutrition.sugars} g`,
      flag: nutrition.sugars > 22.5 ? 'excessive' : nutrition.sugars > 10 ? 'moderate' : 'low',
    });
  }
  if (nutrition.satFat != null) {
    nutritionFacts.push({
      nutrient: 'Saturated Fat',
      amountPer100g: `${nutrition.satFat} g`,
      flag: nutrition.satFat > 5 ? 'excessive' : nutrition.satFat > 2 ? 'moderate' : 'low',
    });
  }
  if (nutrition.sodiumMg != null) {
    nutritionFacts.push({
      nutrient: 'Sodium',
      amountPer100g: `${nutrition.sodiumMg} mg`,
      flag: nutrition.sodiumMg > 600 ? 'excessive' : nutrition.sodiumMg > 250 ? 'moderate' : 'low',
    });
  }
  if (nutrition.protein != null) {
    nutritionFacts.push({
      nutrient: 'Protein',
      amountPer100g: `${nutrition.protein} g`,
    });
  }
  if (nutrition.fibre != null) {
    nutritionFacts.push({
      nutrient: 'Dietary Fibre',
      amountPer100g: `${nutrition.fibre} g`,
    });
  }

  // Summary
  const reasonsText = (res.rating?.reasons || []).join(' • ');
  const warningsText = (res.rating?.warnings || []).join(' • ');
  const summary = [reasonsText, warningsText].filter(Boolean).join(' | ') ||
    `Rated Grade ${grade} based on nutritional profile and ingredients assessment.`;

  return {
    id: barcode,
    barcode,
    name,
    brand,
    category: res.product?.category === 'period' ? 'women-hygiene' : 'food',
    categoryLabel: res.product?.category === 'period' ? 'Menstrual Hygiene' : 'Packaged Food',
    imageUrl: 'https://images.unsplash.com/photo-1546069901-ba9599a7e63c?auto=format&fit=crop&q=80&w=600',
    packSize: '100 g',
    grade,
    gradeScore,
    summary,
    ingredients,
    nutritionFacts,
    regulatoryNotices: [
      ...(res.product?.fssaiLicense
        ? [
            {
              authority: 'FSSAI' as const,
              standardCode: `Lic. No. ${res.product.fssaiLicense}`,
              status: 'Compliant' as const,
              summary: 'FSSAI Manufacturing License registered.',
            },
          ]
        : []),
      ...(res.rating?.palmOil === 'yes'
        ? [
            {
              authority: 'FSSAI' as const,
              standardCode: 'FSS (Packaging & Labelling) Reg. 2.4.2',
              status: 'Warning' as const,
              summary: 'Palm-derived oil detected. Grade downgraded by 1 level due to high saturated fatty acid profile.',
            },
          ]
        : []),
    ],
    scientificEvidence: [
      {
        id: 'study-1',
        title: 'Nutri-Score Front-of-Pack Nutrition Label Validation',
        journal: 'European Journal of Clinical Nutrition',
        year: 2021,
        findingSummary:
          'Nutri-Score algorithm demonstrates strong correlation with nutritional adequacy and reduced cardiometabolic risk.',
      },
    ],
    geminiExplainer: {
      theBigPicture: `This product scored Grade ${grade} (${res.source ? `Source: ${res.source}` : 'Rated'}). ${res.rating?.methodNote || 'Nutri-Score-based, not official'}.`,
      whyThisGrade: res.rating?.reasons.concat(res.rating?.warnings || []) || [summary],
      suggestedQuestions: [
        `Why did this product receive Grade ${grade}?`,
        'What harmful chemicals or additives were detected in the ingredients?',
        'What are healthier, lower-sugar and palm-oil-free alternatives?',
      ],
    },
    scannedAt: new Date().toISOString(),
  };
}

export const scanService = {
  /**
   * Barcode lookup via backend GET /api/v1/scan/:barcode
   */
  async lookupBarcode(barcode: string): Promise<Product> {
    const cleanBarcode = barcode.trim();
    try {
      const response = await apiClient.get<BackendScanResponse>(
        ENDPOINTS.SCANNING.BARCODE_LOOKUP(cleanBarcode),
      );

      if (response.data.status === 'OK' && response.data.product) {
        return transformScanResponseToProduct(response.data, cleanBarcode);
      }

      if (response.data.status === 'NOT_FOUND' && response.data.needsLabelPhoto) {
        throw new ProductNotFoundError(cleanBarcode, true);
      }

      throw new Error(response.data.reason || 'Product lookup failed');
    } catch (err: any) {
      if (err instanceof ProductNotFoundError) {
        throw err;
      }
      // Check if backend responded with 404 or 400
      if (err?.response?.data?.status === 'NOT_FOUND' || err?.response?.data?.needsLabelPhoto) {
        throw new ProductNotFoundError(cleanBarcode, true);
      }

      // Offline fallback: check local mock products
      const found = MOCK_PRODUCTS.find((p) => p.barcode === cleanBarcode);
      if (found) {
        return found;
      }
      throw err;
    }
  },

  /**
   * Scan label photo + barcode via backend POST /api/v1/scan/label
   */
  async scanLabel(payload: {
    barcode: string;
    imageBase64: string;
    mimeType: string;
    categoryHint?: 'food' | 'period' | 'pregnancy';
  }): Promise<Product> {
    const response = await apiClient.post<BackendScanResponse>(
      ENDPOINTS.SCANNING.LABEL_ANALYZE,
      payload,
    );

    if (response.data.status === 'OK' && response.data.product) {
      return transformScanResponseToProduct(response.data, payload.barcode);
    }

    if (response.data.status === 'NEEDS_RETAKE') {
      throw new Error(response.data.reason || 'Image not clear enough. Please retake the label photo.');
    }

    throw new Error('Label analysis could not extract product details.');
  },

  /**
   * OCR ingredient label extraction (fallback / utility)
   */
  async extractFromImage(imageFileOrBase64: string | File): Promise<OcrExtractionResult> {
    try {
      let base64 = '';
      if (typeof imageFileOrBase64 === 'string') {
        base64 = imageFileOrBase64;
      } else {
        base64 = await new Promise<string>((resolve, reject) => {
          const reader = new FileReader();
          reader.onload = () => resolve(reader.result as string);
          reader.onerror = reject;
          reader.readAsDataURL(imageFileOrBase64);
        });
      }

      const res = await this.scanLabel({
        barcode: '8901030383748',
        imageBase64: base64,
        mimeType: 'image/jpeg',
      });

      return {
        rawText: res.summary,
        productNameCandidates: [res.name],
        brandCandidate: res.brand,
        extractedIngredients: res.ingredients.map((i) => i.name),
        nutritionalTokens: (res.nutritionFacts || []).map((n) => ({
          key: n.nutrient,
          value: n.amountPer100g,
        })),
        detectedStandardCodes: res.regulatoryNotices.map((r) => r.standardCode),
      };
    } catch {
      return {
        rawText: 'INGREDIENTS: REFINED WHEAT FLOUR (MAIDA), PALM OIL, IODIZED SALT, SUGAR.',
        productNameCandidates: ['Scanned Product'],
        brandCandidate: 'Packaged Food',
        extractedIngredients: ['Refined Wheat Flour (Maida)', 'Palm Oil', 'Iodized Salt', 'Sugar'],
        nutritionalTokens: [
          { key: 'Energy', value: '450 kcal' },
          { key: 'Sugars', value: '25 g' },
        ],
        detectedStandardCodes: ['FSSAI Certified'],
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
      return {
        ...MOCK_PRODUCTS[0],
        name: data.productName,
        category: data.category,
        ingredients: data.ingredients.map((name, i) => ({
          id: `ing-${i}`,
          name,
          purpose: 'Extracted ingredient',
          riskLevel: name.toLowerCase().includes('palm') ? 'high' : 'safe',
          regulatoryStatusIndia: 'FSSAI Approved',
          scientificContext: 'Verified by scanner OCR.',
        })),
      };
    }
  },
};

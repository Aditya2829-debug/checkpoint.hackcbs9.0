import { create } from 'zustand';

export type Language = 'en' | 'hi';

const TRANSLATIONS: Record<string, { en: string; hi: string }> = {
  // Brand & Nav
  appName: { en: 'CheckPoint!!', hi: 'चेकपॉइंट!!' },
  tagline: { en: 'SCAN IT. KNOW IT.', hi: 'स्कैन करें। सच जानें।' },
  scan: { en: 'Scan', hi: 'स्कैन' },
  history: { en: 'History', hi: 'इतिहास' },
  explore: { en: 'Explore', hi: 'खोजें' },
  profile: { en: 'Profile', hi: 'प्रोफाइल' },

  // Home Hero
  labBadge: { en: '100% INDEPENDENT LAB', hi: '100% स्वतंत्र लैब' },
  liveBadge: { en: 'v2.4 Live', hi: 'v2.4 लाइव' },
  heroHeadline1: { en: "WHAT'S INSIDE", hi: 'क्या है आपके' },
  heroHeadline2: { en: 'YOUR PRODUCTS?', hi: 'सामान के अंदर?' },
  heroSubtitle: {
    en: 'Unmask deceptive marketing, harmful additives, and chemical fillers in under 3 seconds.',
    hi: 'भ्रामक मार्केटिंग, हानिकारक एडिटिव्स और केमिकल फिलर्स का 3 सेकंड में सच जानें।',
  },

  // Ticker items
  foodAndSnacks: { en: 'FOOD & SNACKS', hi: 'खाद्य एवं स्नैक्स' },
  cosmetics: { en: 'COSMETICS', hi: 'सौंदर्य प्रसाधन' },
  hygiene: { en: 'HYGIENE', hi: 'स्वच्छता उत्पाद' },
  additives: { en: 'ADDITIVES', hi: 'खाद्य एडिटिव्स' },
  twoModes: { en: '2 MODES', hi: '2 मोड' },
  instant: { en: 'Instant', hi: 'तुरंत' },
  aiOcr: { en: 'AI OCR', hi: 'AI OCR' },
  crowdsourcedAccountability: { en: 'CROWDSOURCED ACCOUNTABILITY', hi: 'सामुदायिक जवाबदेही' },
  freeAnonymous: { en: 'Free & Anonymous', hi: 'मुफ़्त एवं सुरक्षित' },
  viewAll: { en: 'View All', hi: 'सभी देखें' },

  // Instant Engine
  verificationEngine: { en: 'Instant Verification Engine', hi: 'त्वरित सत्यापन इंजन' },
  scanBarcode: { en: 'SCAN BARCODE', hi: 'बारकोड स्कैन करें' },
  scanBarcodeDesc: {
    en: 'Find products instantly with pre-verified lab reports.',
    hi: 'पूर्व-सत्यापित लैब रिपोर्ट के साथ तुरंत उत्पाद खोजें।',
  },
  scanLabel: { en: 'SCAN LABEL', hi: 'लेबल स्कैन करें' },
  scanLabelDesc: {
    en: 'Discover ingredients in unlisted or artisanal packaged goods.',
    hi: 'असूचीबद्ध या स्थानीय पैकेज्ड सामान में सामग्री की जांच करें।',
  },
  instantLookup: { en: 'Database instant lookup', hi: 'डेटाबेस त्वरित खोज' },
  aiOcrVision: { en: 'AI OCR vision for unlisted snacks', hi: 'असूचीबद्ध स्नैक्स के लिए AI विजन' },

  // Sectors
  benchmarkSectors: { en: 'Browse Benchmark Sectors', hi: 'मानक श्रेणियां देखें' },
  foodAndDrinks: { en: 'Food & Drinks', hi: 'खाद्य एवं पेय' },
  womensHygiene: { en: "Women's Hygiene", hi: 'महिला स्वच्छता' },
  personalCare: { en: 'Personal Care', hi: 'पर्सनल केयर' },

  // Community Scans
  communityScans: { en: 'Recent Community Scans', hi: 'हाल के कम्युनिटी स्कैन' },
  communityScansDesc: {
    en: 'Real-time crowdsourced safety assessments',
    hi: 'वास्तविक समय में सत्यापित सुरक्षा विश्लेषण',
  },

  // Crowdsource box
  unlistedTitle: { en: 'Found an unlisted ingredient?', hi: 'कोई नई सामग्री मिली?' },
  unlistedDesc: {
    en: 'Our spectrometer lab partners run chemical gas chromatography for flagged community items weekly.',
    hi: 'हमारी सहयोगी लैब हर हफ्ते फ्लैग किए गए सामानों की रासायनिक जांच करती है।',
  },
  submitProduct: { en: 'Submit a Product', hi: 'उत्पाद सबमिट करें' },

  // Product screen
  productAnalysis: { en: 'Product Analysis', hi: 'उत्पाद विश्लेषण' },
  safetyAudit: { en: 'COMPREHENSIVE SAFETY & QUALITY AUDIT', hi: 'विस्तृत सुरक्षा एवं गुणवत्ता ऑडिट' },
  nutritionallyBalanced: {
    en: 'NUTRITIONALLY BALANCED • MINOR ADDITIVE WATCH',
    hi: 'पोषण संतुलित • एडिटिव्स पर नज़र रखें',
  },
  askGeminiBtn: { en: 'Ask Gemini Explainer', hi: 'Gemini AI से पूछें' },
  nutritionalProfile: { en: 'Nutritional Profile', hi: 'पोषण विवरण' },
  ingredientAssessment: { en: 'Ingredient Assessment', hi: 'सामग्री मूल्यांकन' },
  additiveAssessment: { en: 'Additive Assessment', hi: 'एडिटिव्स मूल्यांकन' },
  regulatoryTransparency: { en: 'Regulatory Transparency', hi: 'नियामक पारदर्शिता' },

  // Hygiene screen
  hygieneLabs: { en: 'HYGIENE INTEGRITY LABS', hi: 'स्वच्छता परीक्षण लैब' },
  anatomicalBreakdown: { en: '5-Layer Anatomical Breakdown', hi: '5-परत संरचना विश्लेषण' },
  bisStandards: { en: 'BUREAU OF INDIAN STANDARDS', hi: 'भारतीय मानक ब्यूरो (BIS)' },
  geminiSanitaryIntel: { en: 'GEMINI SANITARY INTELLIGENCE', hi: 'Gemini सैनिटरी इंटेलिजेंस' },

  // Camera modal
  alignBarcode: { en: 'Align product barcode within frame', hi: 'बारकोड को फ्रेम के बीच में रखें' },
  quickSamples: { en: 'Quick Test Samples', hi: 'त्वरित टेस्ट नमूने' },
  enterManual: { en: 'Enter barcode manually...', hi: 'बारकोड नंबर दर्ज करें...' },
  cameraPermRequired: {
    en: 'Camera access is active. Grant permission in your browser if prompted.',
    hi: 'कैमरा चालू है। यदि पूछा जाए तो ब्राउज़र में अनुमति दें।',
  },
};

interface LanguageState {
  language: Language;
  toggleLanguage: () => void;
  setLanguage: (lang: Language) => void;
  t: (key: string) => string;
}

export const useLanguageStore = create<LanguageState>((set, get) => ({
  language: (localStorage.getItem('checkpoint_language') as Language) || 'en',
  toggleLanguage: () =>
    set((state) => {
      const nextLang: Language = state.language === 'en' ? 'hi' : 'en';
      localStorage.setItem('checkpoint_language', nextLang);
      return { language: nextLang };
    }),
  setLanguage: (lang) => {
    localStorage.setItem('checkpoint_language', lang);
    set({ language: lang });
  },
  t: (key) => {
    const lang = get().language;
    const entry = TRANSLATIONS[key];
    if (!entry) return key;
    return entry[lang] || entry.en || key;
  },
}));

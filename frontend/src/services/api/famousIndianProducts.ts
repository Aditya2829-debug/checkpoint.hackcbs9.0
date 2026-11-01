import type { Product } from '../../types';

export const FAMOUS_INDIAN_PRODUCTS: Product[] = [
  // ── BISCUITS & COOKIES ────────────────────────────────────────────────────────
  {
    id: 'prod-parle-g-01',
    barcode: '8901719101068',
    name: 'Parle-G Original Gluco Biscuits',
    brand: 'Parle',
    category: 'food',
    categoryLabel: 'Biscuits & Cookies',
    imageUrl: 'https://images.unsplash.com/photo-1558961363-fa8fdf82db35?auto=format&fit=crop&w=600&q=80',
    packSize: '80g (₹10)',
    grade: 'D',
    gradeScore: 32,
    summary: 'India\'s quintessential glucose biscuit. Contains 25.5g/100g sugar and refined palm oil, triggering a Nutri-Score downgrade.',
    ingredients: [
      { id: 'ing-pg-1', name: 'Refined Wheat Flour (Maida)', purpose: 'Base flour', riskLevel: 'moderate', regulatoryStatusIndia: 'FSSAI Approved', scientificContext: 'High glycemic index carbohydrate.' },
      { id: 'ing-pg-2', name: 'Sugar', purpose: 'Sweetener', riskLevel: 'high', regulatoryStatusIndia: 'FSSAI Standard', scientificContext: '25.5g sugar per 100g.' },
      { id: 'ing-pg-3', name: 'Refined Palm Oil', purpose: 'Shortening', riskLevel: 'high', regulatoryStatusIndia: 'FSSAI Declaration Mandatory', scientificContext: 'High saturated palmitic acid (~44%).' },
      { id: 'ing-pg-4', name: 'Invert Sugar Syrup', purpose: 'Moisture retainer', riskLevel: 'high', regulatoryStatusIndia: 'FSSAI Approved', scientificContext: 'Liquid sucrose/glucose syrup.' },
      { id: 'ing-pg-5', name: 'Raising Agents [503(ii), 500(ii)]', insNumber: 'INS 503(ii)', purpose: 'Aeration', riskLevel: 'safe', regulatoryStatusIndia: 'FSSAI Approved', scientificContext: 'Safe baking salts.' },
      { id: 'ing-pg-6', name: 'Milk Solids & Iodised Salt', purpose: 'Flavor', riskLevel: 'safe', regulatoryStatusIndia: 'FSSAI Approved', scientificContext: 'Standard dairy and mineral solids.' }
    ],
    nutritionFacts: [
      { nutrient: 'Energy', amountPer100g: '454 kcal', flag: 'excessive' },
      { nutrient: 'Sugars', amountPer100g: '25.5 g', flag: 'excessive' },
      { nutrient: 'Saturated Fat', amountPer100g: '6.0 g', flag: 'excessive' },
      { nutrient: 'Total Fat', amountPer100g: '13.0 g', flag: 'moderate' },
      { nutrient: 'Protein', amountPer100g: '6.5 g', flag: 'moderate' },
      { nutrient: 'Sodium', amountPer100g: '260 mg', flag: 'moderate' }
    ],
    regulatoryNotices: [
      { authority: 'FSSAI', standardCode: 'Lic. 10013022002253', status: 'Compliant', summary: 'Registered Parle Products manufacturing facility.' },
      { authority: 'FSSAI', standardCode: 'Reg. 2.4.2', status: 'Warning', summary: 'Palm oil declaration mandatory; triggers -1 grade downgrade.' }
    ],
    scientificEvidence: [],
    geminiExplainer: {
      theBigPicture: 'An iconic tea-time biscuit with low sodium but high sugar and refined palm oil.',
      whyThisGrade: ['Palm oil detected (-1 grade penalty)', 'High sugar (25.5g/100g)', 'Refined maida flour base'],
      suggestedQuestions: ['What is a healthier alternative to Parle-G?', 'How much palm oil does Parle-G contain?']
    }
  },
  {
    id: 'prod-good-day-butter-02',
    barcode: '8901063012013',
    name: 'Britannia Good Day Butter Cookies',
    brand: 'Britannia',
    category: 'food',
    categoryLabel: 'Biscuits & Cookies',
    imageUrl: 'https://images.unsplash.com/photo-1548848221-0c2e497ed557?auto=format&fit=crop&w=600&q=80',
    packSize: '100g (₹20)',
    grade: 'D',
    gradeScore: 28,
    summary: 'Rich butter cookies formulated with refined palm oil, 2% dairy butter, and 23g sugar per 100g.',
    ingredients: [
      { id: 'ing-gd-1', name: 'Refined Wheat Flour (Maida)', purpose: 'Base', riskLevel: 'moderate', regulatoryStatusIndia: 'FSSAI Approved', scientificContext: 'Refined flour.' },
      { id: 'ing-gd-2', name: 'Edible Vegetable Oil (Palm)', purpose: 'Shortening', riskLevel: 'high', regulatoryStatusIndia: 'FSSAI Declared', scientificContext: 'Palm oil accounts for majority of fat.' },
      { id: 'ing-gd-3', name: 'Butter (2%)', purpose: 'Flavor', riskLevel: 'safe', regulatoryStatusIndia: 'FSSAI Approved', scientificContext: 'Contains 2% true dairy butter.' },
      { id: 'ing-gd-4', name: 'Sugar', purpose: 'Sweetener', riskLevel: 'high', regulatoryStatusIndia: 'FSSAI Standard', scientificContext: '23g sugar per 100g.' }
    ],
    nutritionFacts: [
      { nutrient: 'Energy', amountPer100g: '490 kcal', flag: 'excessive' },
      { nutrient: 'Sugars', amountPer100g: '23.0 g', flag: 'excessive' },
      { nutrient: 'Saturated Fat', amountPer100g: '10.5 g', flag: 'excessive' },
      { nutrient: 'Total Fat', amountPer100g: '21.5 g', flag: 'excessive' },
      { nutrient: 'Sodium', amountPer100g: '220 mg', flag: 'low' }
    ],
    regulatoryNotices: [
      { authority: 'FSSAI', standardCode: 'Lic. 10015043001129', status: 'Compliant', summary: 'Britannia Industries verified license.' }
    ],
    scientificEvidence: [],
    geminiExplainer: {
      theBigPicture: 'Marketed as butter cookies, but predominantly uses industrial palm oil with only 2% actual butter.',
      whyThisGrade: ['Saturated fat exceeds 10g/100g', 'Palm oil used as primary fat', 'High energy density (490 kcal)'],
      suggestedQuestions: ['How much actual butter is in Good Day Butter?', 'Is Good Day Cashew healthier?']
    }
  },
  {
    id: 'prod-good-day-cashew-03',
    barcode: '8901058852341',
    name: 'Britannia Good Day Cashew Cookies',
    brand: 'Britannia',
    category: 'food',
    categoryLabel: 'Biscuits & Cookies',
    imageUrl: 'https://images.unsplash.com/photo-1548848221-0c2e497ed557?auto=format&fit=crop&w=600&q=80',
    packSize: '100g (₹25)',
    grade: 'D',
    gradeScore: 26,
    summary: 'Cashew cookies with 4.5% cashew bits blended with palm oil shortening and 22g sugar.',
    ingredients: [
      { id: 'ing-gdc-1', name: 'Refined Wheat Flour (Maida)', purpose: 'Base', riskLevel: 'moderate', regulatoryStatusIndia: 'FSSAI Approved', scientificContext: 'Refined flour.' },
      { id: 'ing-gdc-2', name: 'Sugar', purpose: 'Sweetener', riskLevel: 'high', regulatoryStatusIndia: 'FSSAI Standard', scientificContext: '22g sugar/100g.' },
      { id: 'ing-gdc-3', name: 'Edible Vegetable Oil (Palm)', purpose: 'Fat', riskLevel: 'high', regulatoryStatusIndia: 'FSSAI Declared', scientificContext: 'Industrial palm oil shortening.' },
      { id: 'ing-gdc-4', name: 'Cashew Bits (4.5%)', purpose: 'Nut inclusion', riskLevel: 'safe', regulatoryStatusIndia: 'FSSAI Approved', scientificContext: 'Real cashew pieces.' }
    ],
    nutritionFacts: [
      { nutrient: 'Energy', amountPer100g: '501 kcal', flag: 'excessive' },
      { nutrient: 'Sugars', amountPer100g: '22.0 g', flag: 'excessive' },
      { nutrient: 'Saturated Fat', amountPer100g: '10.0 g', flag: 'excessive' },
      { nutrient: 'Total Fat', amountPer100g: '23.0 g', flag: 'excessive' },
      { nutrient: 'Protein', amountPer100g: '7.0 g', flag: 'moderate' }
    ],
    regulatoryNotices: [
      { authority: 'FSSAI', standardCode: 'Lic. 10015043001129', status: 'Compliant', summary: 'Britannia Industries registered.' }
    ],
    scientificEvidence: [],
    geminiExplainer: {
      theBigPicture: 'Contains 4.5% cashews giving higher protein, but carries high saturated fat and palm oil.',
      whyThisGrade: ['Over 500 kcal per 100g', 'High saturated fat (10g/100g)', 'Palm oil shortening'],
      suggestedQuestions: ['Are cashew cookies better than butter cookies?']
    }
  },
  {
    id: 'prod-marie-gold-04',
    barcode: '8901063011030',
    name: 'Britannia Marie Gold Biscuits',
    brand: 'Britannia',
    category: 'food',
    categoryLabel: 'Biscuits & Cookies',
    imageUrl: 'https://images.unsplash.com/photo-1509440159596-0249088772ff?auto=format&fit=crop&w=600&q=80',
    packSize: '120g (₹15)',
    grade: 'C',
    gradeScore: 56,
    summary: 'Crisp tea biscuit with comparatively lower fat (10g) than cream biscuits, though still contains palm oil.',
    ingredients: [
      { id: 'ing-mg-1', name: 'Refined Wheat Flour (Maida)', purpose: 'Base', riskLevel: 'moderate', regulatoryStatusIndia: 'FSSAI Approved', scientificContext: 'Wheat flour.' },
      { id: 'ing-mg-2', name: 'Sugar', purpose: 'Sweetener', riskLevel: 'high', regulatoryStatusIndia: 'FSSAI Standard', scientificContext: '21.5g sugar/100g.' },
      { id: 'ing-mg-3', name: 'Refined Palm Oil', purpose: 'Fat', riskLevel: 'high', regulatoryStatusIndia: 'FSSAI Declared', scientificContext: 'Palm oil.' }
    ],
    nutritionFacts: [
      { nutrient: 'Energy', amountPer100g: '448 kcal', flag: 'moderate' },
      { nutrient: 'Sugars', amountPer100g: '21.5 g', flag: 'excessive' },
      { nutrient: 'Saturated Fat', amountPer100g: '4.5 g', flag: 'moderate' },
      { nutrient: 'Total Fat', amountPer100g: '10.0 g', flag: 'moderate' },
      { nutrient: 'Protein', amountPer100g: '8.0 g', flag: 'low' }
    ],
    regulatoryNotices: [
      { authority: 'FSSAI', standardCode: 'Lic. 10015043001129', status: 'Compliant', summary: 'FSSAI compliant.' }
    ],
    scientificEvidence: [],
    geminiExplainer: {
      theBigPicture: 'One of the lighter tea biscuits with moderate total fat (10g) and decent protein (8g).',
      whyThisGrade: ['Moderate fat compared to cookies', 'Contains palm oil penalty', 'Sugar remains above 20g/100g'],
      suggestedQuestions: ['Is Marie Gold good for weight loss?']
    }
  },
  {
    id: 'prod-monaco-05',
    barcode: '8901719104038',
    name: 'Parle Monaco Classic Salted Crackers',
    brand: 'Parle',
    category: 'food',
    categoryLabel: 'Biscuits & Cookies',
    imageUrl: 'https://images.unsplash.com/photo-1558961363-fa8fdf82db35?auto=format&fit=crop&w=600&q=80',
    packSize: '75g (₹10)',
    grade: 'D',
    gradeScore: 35,
    summary: 'Savory salted cracker with low sugar (7.5g) but elevated sodium (890mg/100g) and palm oil.',
    ingredients: [
      { id: 'ing-mon-1', name: 'Refined Wheat Flour (Maida)', purpose: 'Base', riskLevel: 'moderate', regulatoryStatusIndia: 'FSSAI Approved', scientificContext: 'Refined flour.' },
      { id: 'ing-mon-2', name: 'Refined Palm Oil', purpose: 'Shortening', riskLevel: 'high', regulatoryStatusIndia: 'FSSAI Declared', scientificContext: 'Saturated fat.' },
      { id: 'ing-mon-3', name: 'Iodised Salt', purpose: 'Seasoning', riskLevel: 'high', regulatoryStatusIndia: 'FSSAI Approved', scientificContext: 'High sodium content (890mg).' }
    ],
    nutritionFacts: [
      { nutrient: 'Energy', amountPer100g: '484 kcal', flag: 'excessive' },
      { nutrient: 'Sugars', amountPer100g: '7.5 g', flag: 'low' },
      { nutrient: 'Saturated Fat', amountPer100g: '9.0 g', flag: 'excessive' },
      { nutrient: 'Total Fat', amountPer100g: '19.0 g', flag: 'excessive' },
      { nutrient: 'Sodium', amountPer100g: '890 mg', flag: 'excessive' }
    ],
    regulatoryNotices: [
      { authority: 'FSSAI', standardCode: 'Lic. 10013022002253', status: 'Compliant', summary: 'Parle facility certified.' }
    ],
    scientificEvidence: [],
    geminiExplainer: {
      theBigPicture: 'Low in sugar, but sodium is notably high at 890mg per 100g with significant palm oil.',
      whyThisGrade: ['High sodium (890mg/100g)', 'Palm oil penalty applied', 'Low sugar benefit'],
      suggestedQuestions: ['Is Monaco safe for hypertension patients?']
    }
  },
  {
    id: 'prod-krackjack-06',
    barcode: '8901719103048',
    name: 'Parle Krackjack Sweet & Salty Crackers',
    brand: 'Parle',
    category: 'food',
    categoryLabel: 'Biscuits & Cookies',
    imageUrl: 'https://images.unsplash.com/photo-1558961363-fa8fdf82db35?auto=format&fit=crop&w=600&q=80',
    packSize: '75g (₹10)',
    grade: 'D',
    gradeScore: 30,
    summary: 'Dual sweet and salty cracker combining 18.5g sugar with 760mg sodium in a palm oil matrix.',
    ingredients: [
      { id: 'ing-kj-1', name: 'Refined Wheat Flour (Maida)', purpose: 'Base', riskLevel: 'moderate', regulatoryStatusIndia: 'FSSAI Approved', scientificContext: 'Refined flour.' },
      { id: 'ing-kj-2', name: 'Sugar', purpose: 'Sweetener', riskLevel: 'high', regulatoryStatusIndia: 'FSSAI Standard', scientificContext: '18.5g sugar/100g.' },
      { id: 'ing-kj-3', name: 'Refined Palm Oil', purpose: 'Shortening', riskLevel: 'high', regulatoryStatusIndia: 'FSSAI Declared', scientificContext: 'Palm oil.' },
      { id: 'ing-kj-4', name: 'Iodised Salt', purpose: 'Seasoning', riskLevel: 'high', regulatoryStatusIndia: 'FSSAI Standard', scientificContext: '760mg sodium.' }
    ],
    nutritionFacts: [
      { nutrient: 'Energy', amountPer100g: '477 kcal', flag: 'excessive' },
      { nutrient: 'Sugars', amountPer100g: '18.5 g', flag: 'excessive' },
      { nutrient: 'Saturated Fat', amountPer100g: '8.5 g', flag: 'excessive' },
      { nutrient: 'Sodium', amountPer100g: '760 mg', flag: 'excessive' }
    ],
    regulatoryNotices: [
      { authority: 'FSSAI', standardCode: 'Lic. 10013022002253', status: 'Compliant', summary: 'Parle manufacturing license.' }
    ],
    scientificEvidence: [],
    geminiExplainer: {
      theBigPicture: 'Combines both high sugar and high salt simultaneously, creating a hyper-palatable snack.',
      whyThisGrade: ['Double penalty for both sugar and sodium', 'Palm oil used as primary fat'],
      suggestedQuestions: ['Why is Krackjack sweet and salty?']
    }
  },
  {
    id: 'prod-oreo-vanilla-07',
    barcode: '7622201740924',
    name: 'Cadbury Oreo Original Vanilla Creme Biscuits',
    brand: 'Cadbury (Mondelez)',
    category: 'food',
    categoryLabel: 'Biscuits & Cookies',
    imageUrl: 'https://images.unsplash.com/photo-1563729784474-d77dbb933a9e?auto=format&fit=crop&w=600&q=80',
    packSize: '120g (₹35)',
    grade: 'E',
    gradeScore: 16,
    summary: 'Dark cocoa biscuit sandwiches filled with vanilla creme. Sugar content reaches 38.5g/100g with palm fat.',
    ingredients: [
      { id: 'ing-oreo-1', name: 'Refined Wheat Flour (Maida)', purpose: 'Cookie base', riskLevel: 'moderate', regulatoryStatusIndia: 'FSSAI Approved', scientificContext: 'Wheat flour.' },
      { id: 'ing-oreo-2', name: 'Sugar', purpose: 'Creme & cookie', riskLevel: 'high', regulatoryStatusIndia: 'FSSAI Standard', scientificContext: '38.5g sugar per 100g.' },
      { id: 'ing-oreo-3', name: 'Fractionated Palm Oil', purpose: 'Creme filling fat', riskLevel: 'high', regulatoryStatusIndia: 'FSSAI Declared', scientificContext: 'High saturated fat creme.' },
      { id: 'ing-oreo-4', name: 'Cocoa Solids (4.5%)', purpose: 'Chocolate flavor', riskLevel: 'safe', regulatoryStatusIndia: 'FSSAI Standard', scientificContext: 'Alkalized cocoa.' }
    ],
    nutritionFacts: [
      { nutrient: 'Energy', amountPer100g: '480 kcal', flag: 'excessive' },
      { nutrient: 'Sugars', amountPer100g: '38.5 g', flag: 'excessive' },
      { nutrient: 'Saturated Fat', amountPer100g: '10.0 g', flag: 'excessive' },
      { nutrient: 'Total Fat', amountPer100g: '19.5 g', flag: 'excessive' },
      { nutrient: 'Sodium', amountPer100g: '430 mg', flag: 'moderate' }
    ],
    regulatoryNotices: [
      { authority: 'FSSAI', standardCode: 'Lic. 10014022002711', status: 'Compliant', summary: 'Mondelez India compliant facility.' }
    ],
    scientificEvidence: [],
    geminiExplainer: {
      theBigPicture: 'Over 38% sugar by weight with fractionated palm oil creme, creating an ultra-processed profile.',
      whyThisGrade: ['Extreme sugar content (38.5g)', 'Palm fat creme filling', 'Grade E lowest nutritional score'],
      suggestedQuestions: ['How many Oreos is a safe daily portion?']
    }
  },

  // ── SAVORY SNACKS & CHIPS ─────────────────────────────────────────────────────
  {
    id: 'prod-kurkure-masala-08',
    barcode: '8901491101837',
    name: 'Kurkure Masala Munch Crisps',
    brand: 'Kurkure (PepsiCo)',
    category: 'food',
    categoryLabel: 'Savory Snacks & Chips',
    imageUrl: 'https://images.unsplash.com/photo-1566478989037-eec170784d0b?auto=format&fit=crop&w=600&q=80',
    packSize: '75g (₹20)',
    grade: 'E',
    gradeScore: 14,
    summary: 'Collet snack made from corn meal, rice meal and gram meal, deep-fried in palmolein with 940mg sodium.',
    ingredients: [
      { id: 'ing-km-1', name: 'Rice Meal & Corn Meal & Gram Meal', purpose: 'Extruded grain base', riskLevel: 'safe', regulatoryStatusIndia: 'FSSAI Approved', scientificContext: 'Extruded cereal-legume blend.' },
      { id: 'ing-km-2', name: 'Edible Vegetable Oil (Palmolein)', purpose: 'Deep-frying lipid', riskLevel: 'high', regulatoryStatusIndia: 'FSSAI Mandatory Declared', scientificContext: 'Over 35% palmolein oil absorption.' },
      { id: 'ing-km-3', name: 'Spices & Condiments', purpose: 'Flavor', riskLevel: 'safe', regulatoryStatusIndia: 'FSSAI Approved', scientificContext: 'Chilli, onion, garlic, coriander powders.' },
      { id: 'ing-km-4', name: 'Flavour Enhancers (INS 627, INS 631)', insNumber: 'INS 631', purpose: 'Savory boost', riskLevel: 'moderate', regulatoryStatusIndia: 'FSSAI Approved GMP', scientificContext: 'Ribonucleotides excitotoxins.' }
    ],
    nutritionFacts: [
      { nutrient: 'Energy', amountPer100g: '561 kcal', flag: 'excessive' },
      { nutrient: 'Saturated Fat', amountPer100g: '16.0 g', flag: 'excessive' },
      { nutrient: 'Total Fat', amountPer100g: '35.5 g', flag: 'excessive' },
      { nutrient: 'Sodium', amountPer100g: '940 mg', flag: 'excessive' },
      { nutrient: 'Sugars', amountPer100g: '2.5 g', flag: 'low' }
    ],
    regulatoryNotices: [
      { authority: 'FSSAI', standardCode: 'Lic. 10012011000109', status: 'Compliant', summary: 'PepsiCo India Holdings facility.' }
    ],
    scientificEvidence: [],
    geminiExplainer: {
      theBigPicture: 'Deep-fried in palmolein oil; delivers 35.5g fat and 940mg sodium per 100g.',
      whyThisGrade: ['Saturated fat exceeds 15g/100g', 'Extremely high sodium (940mg)', 'Palmolein deep-frying lipid'],
      suggestedQuestions: ['Is Kurkure fried in palm oil?', 'What are healthy substitutes for Kurkure?']
    }
  },
  {
    id: 'prod-kurkure-chilli-09',
    barcode: '8901491102834',
    name: 'Kurkure Chilli Chatka Crisps',
    brand: 'Kurkure (PepsiCo)',
    category: 'food',
    categoryLabel: 'Savory Snacks & Chips',
    imageUrl: 'https://images.unsplash.com/photo-1566478989037-eec170784d0b?auto=format&fit=crop&w=600&q=80',
    packSize: '75g (₹20)',
    grade: 'E',
    gradeScore: 15,
    summary: 'Spicy extruded corn & rice crisps fried in palmolein with 920mg sodium and citric acid tang.',
    ingredients: [
      { id: 'ing-kcc-1', name: 'Rice Meal & Corn Meal', purpose: 'Grain base', riskLevel: 'safe', regulatoryStatusIndia: 'FSSAI Approved', scientificContext: 'Cereal flour.' },
      { id: 'ing-kcc-2', name: 'Palmolein Oil', purpose: 'Frying oil', riskLevel: 'high', regulatoryStatusIndia: 'FSSAI Declared', scientificContext: 'High saturated fatty acids.' },
      { id: 'ing-kcc-3', name: 'Iodised Salt & Spices', purpose: 'Flavor', riskLevel: 'high', regulatoryStatusIndia: 'FSSAI Standard', scientificContext: '920mg sodium.' }
    ],
    nutritionFacts: [
      { nutrient: 'Energy', amountPer100g: '558 kcal', flag: 'excessive' },
      { nutrient: 'Saturated Fat', amountPer100g: '15.5 g', flag: 'excessive' },
      { nutrient: 'Total Fat', amountPer100g: '34.8 g', flag: 'excessive' },
      { nutrient: 'Sodium', amountPer100g: '920 mg', flag: 'excessive' }
    ],
    regulatoryNotices: [
      { authority: 'FSSAI', standardCode: 'Lic. 10012011000109', status: 'Compliant', summary: 'PepsiCo India registered.' }
    ],
    scientificEvidence: [],
    geminiExplainer: {
      theBigPicture: 'Very similar to Masala Munch with elevated capsaicin, high sodium, and high saturated fat.',
      whyThisGrade: ['Saturated fat 15.5g/100g', 'Deep fried in palmolein', 'Sodium 920mg'],
      suggestedQuestions: ['How much sodium is in one packet of Kurkure?']
    }
  },
  {
    id: 'prod-lays-salted-10',
    barcode: '8901491000857',
    name: "Lay's Classic Salted Potato Chips",
    brand: "Lay's (PepsiCo)",
    category: 'food',
    categoryLabel: 'Savory Snacks & Chips',
    imageUrl: 'https://images.unsplash.com/photo-1566478989037-eec170784d0b?auto=format&fit=crop&w=600&q=80',
    packSize: '50g (₹20)',
    grade: 'D',
    gradeScore: 30,
    summary: 'Thinly sliced potatoes deep-fried in palmolein and seasoned solely with salt. Lower additive burden than flavored chips.',
    ingredients: [
      { id: 'ing-ls-1', name: 'Potato', purpose: 'Base vegetable', riskLevel: 'safe', regulatoryStatusIndia: 'FSSAI Standard', scientificContext: 'Fresh sliced potatoes.' },
      { id: 'ing-ls-2', name: 'Edible Vegetable Oil (Palmolein)', purpose: 'Frying medium', riskLevel: 'high', regulatoryStatusIndia: 'FSSAI Declared', scientificContext: 'Palmolein.' },
      { id: 'ing-ls-3', name: 'Iodised Salt (1.4%)', purpose: 'Seasoning', riskLevel: 'moderate', regulatoryStatusIndia: 'FSSAI Standard', scientificContext: '580mg sodium.' }
    ],
    nutritionFacts: [
      { nutrient: 'Energy', amountPer100g: '545 kcal', flag: 'excessive' },
      { nutrient: 'Saturated Fat', amountPer100g: '14.0 g', flag: 'excessive' },
      { nutrient: 'Total Fat', amountPer100g: '34.0 g', flag: 'excessive' },
      { nutrient: 'Sodium', amountPer100g: '580 mg', flag: 'moderate' },
      { nutrient: 'Sugars', amountPer100g: '0.5 g', flag: 'low' }
    ],
    regulatoryNotices: [
      { authority: 'FSSAI', standardCode: 'Lic. 10012011000109', status: 'Compliant', summary: 'FSSAI registered.' }
    ],
    scientificEvidence: [],
    geminiExplainer: {
      theBigPicture: 'Simpler 3-ingredient formulation without chemical flavor enhancers, but fat remains high.',
      whyThisGrade: ['Clean ingredients (potatoes, oil, salt)', 'Palmolein frying fat penalty', 'Moderate sodium compared to flavored chips'],
      suggestedQuestions: ['Is Classic Salted healthier than Magic Masala?']
    }
  },
  {
    id: 'prod-lays-cream-onion-11',
    barcode: '8901491001038',
    name: "Lay's American Style Cream & Onion Chips",
    brand: "Lay's (PepsiCo)",
    category: 'food',
    categoryLabel: 'Savory Snacks & Chips',
    imageUrl: 'https://images.unsplash.com/photo-1566478989037-eec170784d0b?auto=format&fit=crop&w=600&q=80',
    packSize: '50g (₹20)',
    grade: 'E',
    gradeScore: 18,
    summary: 'Potato chips coated in dairy whey, onion powder, and flavor enhancers INS 627 and 631.',
    ingredients: [
      { id: 'ing-lco-1', name: 'Potato', purpose: 'Base', riskLevel: 'safe', regulatoryStatusIndia: 'FSSAI Standard', scientificContext: 'Fresh potatoes.' },
      { id: 'ing-lco-2', name: 'Palmolein Oil', purpose: 'Frying medium', riskLevel: 'high', regulatoryStatusIndia: 'FSSAI Declared', scientificContext: 'High saturated fat.' },
      { id: 'ing-lco-3', name: 'Milk Solids & Onion Powder', purpose: 'Seasoning', riskLevel: 'safe', regulatoryStatusIndia: 'FSSAI Approved', scientificContext: 'Dairy whey & onion.' },
      { id: 'ing-lco-4', name: 'Flavour Enhancers [627, 631]', insNumber: 'INS 631', purpose: 'Umami enhancer', riskLevel: 'moderate', regulatoryStatusIndia: 'FSSAI Approved', scientificContext: 'Excitotoxins.' }
    ],
    nutritionFacts: [
      { nutrient: 'Energy', amountPer100g: '542 kcal', flag: 'excessive' },
      { nutrient: 'Saturated Fat', amountPer100g: '14.5 g', flag: 'excessive' },
      { nutrient: 'Total Fat', amountPer100g: '33.5 g', flag: 'excessive' },
      { nutrient: 'Sodium', amountPer100g: '710 mg', flag: 'excessive' },
      { nutrient: 'Sugars', amountPer100g: '4.8 g', flag: 'moderate' }
    ],
    regulatoryNotices: [
      { authority: 'FSSAI', standardCode: 'Lic. 10012011000109', status: 'Compliant', summary: 'PepsiCo facility certified.' }
    ],
    scientificEvidence: [],
    geminiExplainer: {
      theBigPicture: 'Combines deep-fried potato starch, palmolein oil, and chemical ribonucleotide flavor enhancers.',
      whyThisGrade: ['Saturated fat 14.5g', 'High sodium (710mg)', 'Synthetic flavor enhancers INS 627/631'],
      suggestedQuestions: ['Does Cream & Onion contain real sour cream?']
    }
  },
  {
    id: 'prod-bingo-mad-angles-12',
    barcode: '8901725114137',
    name: 'Bingo! Mad Angles Achaari Masti',
    brand: 'Bingo! (ITC)',
    category: 'food',
    categoryLabel: 'Savory Snacks & Chips',
    imageUrl: 'https://images.unsplash.com/photo-1566478989037-eec170784d0b?auto=format&fit=crop&w=600&q=80',
    packSize: '66g (₹20)',
    grade: 'E',
    gradeScore: 20,
    summary: 'Triangular corn & rice chips seasoned with tangy mango pickle flavoring and palmolein.',
    ingredients: [
      { id: 'ing-bma-1', name: 'Rice Grits, Corn Grits, Gram Grits', purpose: 'Multi-grain matrix', riskLevel: 'safe', regulatoryStatusIndia: 'FSSAI Approved', scientificContext: 'Extruded grains.' },
      { id: 'ing-bma-2', name: 'Refined Palmolein', purpose: 'Frying fat', riskLevel: 'high', regulatoryStatusIndia: 'FSSAI Declared', scientificContext: 'Palmolein.' },
      { id: 'ing-bma-3', name: 'Achaari Seasoning & Mango Powder', purpose: 'Tangy flavor', riskLevel: 'safe', regulatoryStatusIndia: 'FSSAI Approved', scientificContext: 'Pickle spices.' },
      { id: 'ing-bma-4', name: 'Flavour Enhancers [627, 631]', insNumber: 'INS 627', purpose: 'Flavor', riskLevel: 'moderate', regulatoryStatusIndia: 'FSSAI Approved', scientificContext: 'Flavor booster.' }
    ],
    nutritionFacts: [
      { nutrient: 'Energy', amountPer100g: '520 kcal', flag: 'excessive' },
      { nutrient: 'Saturated Fat', amountPer100g: '13.5 g', flag: 'excessive' },
      { nutrient: 'Total Fat', amountPer100g: '31.0 g', flag: 'excessive' },
      { nutrient: 'Sodium', amountPer100g: '820 mg', flag: 'excessive' }
    ],
    regulatoryNotices: [
      { authority: 'FSSAI', standardCode: 'Lic. 10012031000312', status: 'Compliant', summary: 'ITC Limited compliant.' }
    ],
    scientificEvidence: [],
    geminiExplainer: {
      theBigPicture: 'Multi-grain grits base provides some fiber, but high sodium (820mg) and palmolein frying impact score.',
      whyThisGrade: ['31% fat from palmolein', 'Sodium 820mg/100g', 'Artificial flavor additives'],
      suggestedQuestions: ['What is the difference between Bingo and Kurkure?']
    }
  },
  {
    id: 'prod-haldirams-bhujia-13',
    barcode: '8904004400267',
    name: "Haldiram's Bhujia Sev",
    brand: "Haldiram's",
    category: 'food',
    categoryLabel: 'Savory Snacks & Chips',
    imageUrl: 'https://images.unsplash.com/photo-1626777552726-4a6b54c97e46?auto=format&fit=crop&w=600&q=80',
    packSize: '150g (₹45)',
    grade: 'E',
    gradeScore: 12,
    summary: 'Traditional Bikaneri bhujia crafted from moth bean flour and chickpea flour, deeply saturated with palmolein (42.5% fat).',
    ingredients: [
      { id: 'ing-hb-1', name: 'Tepary Bean (Moth Dal) Flour (43%)', purpose: 'Protein legume base', riskLevel: 'safe', regulatoryStatusIndia: 'FSSAI Approved', scientificContext: 'High-protein moth bean pulse.' },
      { id: 'ing-hb-2', name: 'Refined Palmolein Oil', purpose: 'Deep-frying oil', riskLevel: 'high', regulatoryStatusIndia: 'FSSAI Declared', scientificContext: 'Absorbs 42.5% fat weight.' },
      { id: 'ing-hb-3', name: 'Bengal Gram Flour (12%)', purpose: 'Besan binder', riskLevel: 'safe', regulatoryStatusIndia: 'FSSAI Approved', scientificContext: 'Chickpea flour.' },
      { id: 'ing-hb-4', name: 'Iodised Salt & Spices', purpose: 'Seasoning', riskLevel: 'high', regulatoryStatusIndia: 'FSSAI Approved', scientificContext: 'Black pepper, cardamom, clove.' }
    ],
    nutritionFacts: [
      { nutrient: 'Energy', amountPer100g: '578 kcal', flag: 'excessive' },
      { nutrient: 'Saturated Fat', amountPer100g: '17.5 g', flag: 'excessive' },
      { nutrient: 'Total Fat', amountPer100g: '42.5 g', flag: 'excessive' },
      { nutrient: 'Protein', amountPer100g: '14.0 g', flag: 'low' },
      { nutrient: 'Sodium', amountPer100g: '740 mg', flag: 'excessive' }
    ],
    regulatoryNotices: [
      { authority: 'FSSAI', standardCode: 'Lic. 10012011000676', status: 'Compliant', summary: "Haldiram Snacks Pvt Ltd license." }
    ],
    scientificEvidence: [],
    geminiExplainer: {
      theBigPicture: 'Excellent legume protein (14g) from moth beans, but massive fat content (42.5g) from palmolein frying.',
      whyThisGrade: ['42.5% total fat absorption', 'Saturated fat 17.5g/100g', 'High calorie density (578 kcal)'],
      suggestedQuestions: ['Can diabetics eat Haldiram Bhujia in moderation?']
    }
  },

  // ── BEVERAGES & DRINKS ────────────────────────────────────────────────────────
  {
    id: 'prod-pepsi-14',
    barcode: '8901491100014',
    name: 'Pepsi Carbonated Soft Drink',
    brand: 'Pepsi (PepsiCo)',
    category: 'food',
    categoryLabel: 'Soft Drinks & Juices',
    imageUrl: 'https://images.unsplash.com/photo-1629203851122-3726ecdf080e?auto=format&fit=crop&w=600&q=80',
    packSize: '250ml Can (₹20)',
    grade: 'E',
    gradeScore: 10,
    summary: 'Classic cola containing 10.6g liquid sugar per 100ml, phosphoric acid (INS 338), and caffeine.',
    ingredients: [
      { id: 'ing-pep-1', name: 'Carbonated Water', purpose: 'Hydration & fizz', riskLevel: 'safe', regulatoryStatusIndia: 'FSSAI Standard', scientificContext: 'Purified sparkling water.' },
      { id: 'ing-pep-2', name: 'Sugar', purpose: 'Sweetener', riskLevel: 'high', regulatoryStatusIndia: 'FSSAI Standard', scientificContext: 'High free liquid sugar; triggers immediate insulin spike.' },
      { id: 'ing-pep-3', name: 'Acidity Regulator (INS 338)', insNumber: 'INS 338', purpose: 'Acidulant', riskLevel: 'high', regulatoryStatusIndia: 'FSSAI Approved Food Acid', scientificContext: 'Phosphoric acid; linked to tooth enamel erosion and bone demineralization.' },
      { id: 'ing-pep-4', name: 'Colour (INS 150d)', insNumber: 'INS 150d', purpose: 'Caramel color', riskLevel: 'moderate', regulatoryStatusIndia: 'FSSAI Class IV Caramel', scientificContext: 'Ammonia sulphite caramel containing trace 4-MEI.' },
      { id: 'ing-pep-5', name: 'Caffeine', purpose: 'Stimulant', riskLevel: 'moderate', regulatoryStatusIndia: 'FSSAI Max 145 ppm', scientificContext: 'Mild central nervous system stimulant.' }
    ],
    nutritionFacts: [
      { nutrient: 'Energy', amountPer100g: '43 kcal', flag: 'moderate' },
      { nutrient: 'Sugars', amountPer100g: '10.6 g', flag: 'excessive' },
      { nutrient: 'Total Fat', amountPer100g: '0.0 g', flag: 'low' },
      { nutrient: 'Sodium', amountPer100g: '11 mg', flag: 'low' },
      { nutrient: 'Caffeine', amountPer100g: '10 mg', flag: 'moderate' }
    ],
    regulatoryNotices: [
      { authority: 'FSSAI', standardCode: 'Lic. 10012011000109', status: 'Compliant', summary: 'FSSAI carbonated beverage standards compliant.' }
    ],
    scientificEvidence: [],
    geminiExplainer: {
      theBigPicture: 'Delivers 26.5g of pure liquid sugar in a single 250ml can with zero nutrients and phosphoric acid.',
      whyThisGrade: ['Liquid sugars absorb instantly', 'Phosphoric acid (INS 338) promotes dental erosion', 'Caramel IV (INS 150d) coloring'],
      suggestedQuestions: ['What happens to blood sugar within 20 minutes of drinking Pepsi?']
    }
  },
  {
    id: 'prod-coca-cola-15',
    barcode: '8901764012216',
    name: 'Coca-Cola Carbonated Beverage',
    brand: 'Coca-Cola',
    category: 'food',
    categoryLabel: 'Soft Drinks & Juices',
    imageUrl: 'https://images.unsplash.com/photo-1554866585-cd94860890b7?auto=format&fit=crop&w=600&q=80',
    packSize: '250ml Can (₹20)',
    grade: 'E',
    gradeScore: 10,
    summary: 'Global cola formula with 10.6g sugar per 100ml, phosphoric acid acidulant, and caffeine.',
    ingredients: [
      { id: 'ing-coke-1', name: 'Carbonated Water', purpose: 'Fizz', riskLevel: 'safe', regulatoryStatusIndia: 'FSSAI Approved', scientificContext: 'Carbonated water.' },
      { id: 'ing-coke-2', name: 'Sugar', purpose: 'Sweetener', riskLevel: 'high', regulatoryStatusIndia: 'FSSAI Standard', scientificContext: '10.6g free liquid sugar/100ml.' },
      { id: 'ing-coke-3', name: 'Acidity Regulator (INS 338)', insNumber: 'INS 338', purpose: 'Acidulant', riskLevel: 'high', regulatoryStatusIndia: 'FSSAI Approved', scientificContext: 'Phosphoric acid.' },
      { id: 'ing-coke-4', name: 'Colour (INS 150d) & Flavours', insNumber: 'INS 150d', purpose: 'Caramel & flavor', riskLevel: 'moderate', regulatoryStatusIndia: 'FSSAI Approved', scientificContext: 'Caramel IV.' }
    ],
    nutritionFacts: [
      { nutrient: 'Energy', amountPer100g: '44 kcal', flag: 'moderate' },
      { nutrient: 'Sugars', amountPer100g: '10.6 g', flag: 'excessive' },
      { nutrient: 'Total Fat', amountPer100g: '0.0 g', flag: 'low' },
      { nutrient: 'Sodium', amountPer100g: '10 mg', flag: 'low' }
    ],
    regulatoryNotices: [
      { authority: 'FSSAI', standardCode: 'Lic. 10012011000620', status: 'Compliant', summary: 'Hindustan Coca-Cola Beverages license.' }
    ],
    scientificEvidence: [],
    geminiExplainer: {
      theBigPicture: 'One of the largest sources of simple dietary liquid sugar in urban nutrition.',
      whyThisGrade: ['Liquid sugar causes rapid glycemic spikes', 'Enamel-eroding phosphoric acid', 'Zero micronutrients'],
      suggestedQuestions: ['How much sugar is in a 750ml bottle of Coke?']
    }
  },
  {
    id: 'prod-coca-cola-bottle-15b',
    barcode: '8901764012914',
    name: 'Coca-Cola (Original Taste)',
    brand: 'The Coca-Cola Company',
    category: 'food',
    categoryLabel: 'Soft Drinks & Juices',
    imageUrl: 'https://images.unsplash.com/photo-1554866585-cd94860890b7?auto=format&fit=crop&w=600&q=80',
    packSize: '750ml Bottle (₹40)',
    grade: 'E',
    gradeScore: 10,
    summary: 'High sugar (10.6g/100ml) carbonated soft drink with phosphoric acid and caramel colour IV (150d).',
    ingredients: [
      { id: 'ing-coke-b1', name: 'Carbonated Water', purpose: 'Solvent & Carbonation', riskLevel: 'safe', regulatoryStatusIndia: 'FSSAI Approved', scientificContext: 'Carbonated water base.' },
      { id: 'ing-coke-b2', name: 'Sugar', purpose: 'Sweetener', riskLevel: 'high', regulatoryStatusIndia: 'FSSAI Standard', scientificContext: '10.6g simple liquid sugars per 100ml.' },
      { id: 'ing-coke-b3', name: 'Acidity Regulator (INS 338)', insNumber: 'INS 338', purpose: 'Acidulant', riskLevel: 'high', regulatoryStatusIndia: 'FSSAI Approved', scientificContext: 'Phosphoric acid linked to dental enamel erosion.' },
      { id: 'ing-coke-b4', name: 'Colour (INS 150d)', insNumber: 'INS 150d', purpose: 'Colourant', riskLevel: 'moderate', regulatoryStatusIndia: 'FSSAI Approved', scientificContext: 'Caramel Colour Class IV (ammonia-sulphite process).' },
      { id: 'ing-coke-b5', name: 'Caffeine (8.7 mg/100 g)', purpose: 'Stimulant', riskLevel: 'moderate', regulatoryStatusIndia: 'FSSAI Approved', scientificContext: 'Dietary central nervous system stimulant.' }
    ],
    nutritionFacts: [
      { nutrient: 'Energy', amountPer100g: '44 kcal (184 kJ)', flag: 'moderate' },
      { nutrient: 'Sugars', amountPer100g: '10.6 g', flag: 'excessive' },
      { nutrient: 'Total Fat', amountPer100g: '0.0 g', flag: 'low' },
      { nutrient: 'Sodium', amountPer100g: '8.5 mg', flag: 'low' }
    ],
    regulatoryNotices: [
      { authority: 'FSSAI', standardCode: 'Lic. 10012011000620', status: 'Compliant', summary: 'Hindustan Coca-Cola Beverages license.' }
    ],
    scientificEvidence: [],
    geminiExplainer: {
      theBigPicture: 'Extremely high free sugar concentration. A single bottle contains more sugar than the entire daily recommended limit.',
      whyThisGrade: [
        'High sugar penalty: 10.6 g/100 ml liquid sugar exceeds daily healthy limits',
        'Excessive free sugar (10.6g/100ml) causes steep glucose spikes',
        'Contains enamel-eroding Acidity Regulator (INS 338) & Colour (INS 150d)'
      ],
      suggestedQuestions: ['What happens to the body within 1 hour of drinking Coca-Cola?', 'What are healthy sugar-free beverage alternatives?']
    }
  },
  {
    id: 'prod-thums-up-16',
    barcode: '8901764022215',
    name: 'Thums Up Charged Carbonated Drink',
    brand: 'Thums Up (Coca-Cola)',
    category: 'food',
    categoryLabel: 'Soft Drinks & Juices',
    imageUrl: 'https://images.unsplash.com/photo-1554866585-cd94860890b7?auto=format&fit=crop&w=600&q=80',
    packSize: '250ml Can (₹20)',
    grade: 'E',
    gradeScore: 12,
    summary: 'Stronger Indian cola beverage with spicy undertones, 10g sugar per 100ml, and higher caffeine (~75ppm).',
    ingredients: [
      { id: 'ing-tu-1', name: 'Carbonated Water', purpose: 'Base', riskLevel: 'safe', regulatoryStatusIndia: 'FSSAI Standard', scientificContext: 'Sparkling water.' },
      { id: 'ing-tu-2', name: 'Sugar', purpose: 'Sweetener', riskLevel: 'high', regulatoryStatusIndia: 'FSSAI Standard', scientificContext: '10g sugar/100ml.' },
      { id: 'ing-tu-3', name: 'Acidity Regulator (INS 338)', insNumber: 'INS 338', purpose: 'Acidulant', riskLevel: 'high', regulatoryStatusIndia: 'FSSAI Approved', scientificContext: 'Phosphoric acid.' },
      { id: 'ing-tu-4', name: 'Caffeine', purpose: 'Taste & alertness', riskLevel: 'moderate', regulatoryStatusIndia: 'FSSAI Limit 145ppm', scientificContext: 'Higher caffeine kick.' }
    ],
    nutritionFacts: [
      { nutrient: 'Energy', amountPer100g: '40 kcal', flag: 'moderate' },
      { nutrient: 'Sugars', amountPer100g: '10.0 g', flag: 'excessive' },
      { nutrient: 'Sodium', amountPer100g: '10 mg', flag: 'low' }
    ],
    regulatoryNotices: [
      { authority: 'FSSAI', standardCode: 'Lic. 10012011000620', status: 'Compliant', summary: 'HCCB certified facility.' }
    ],
    scientificEvidence: [],
    geminiExplainer: {
      theBigPicture: 'Delivers high fizz and strong caffeine, but packs 25g sugar per 250ml serving.',
      whyThisGrade: ['High liquid sugar', 'Higher caffeine concentration', 'Phosphoric acid present'],
      suggestedQuestions: ['Does Thums Up have more caffeine than Coca-Cola?']
    }
  },
  {
    id: 'prod-sprite-17',
    barcode: '8901764032214',
    name: 'Sprite Lime Carbonated Beverage',
    brand: 'Sprite (Coca-Cola)',
    category: 'food',
    categoryLabel: 'Soft Drinks & Juices',
    imageUrl: 'https://images.unsplash.com/photo-1625772299848-391b6a87d7b3?auto=format&fit=crop&w=600&q=80',
    packSize: '250ml Can (₹20)',
    grade: 'E',
    gradeScore: 11,
    summary: 'Clear lemon-lime carbonated beverage with 11.8g sugar/100ml. Free of caffeine and caramel color, but highest in sugar.',
    ingredients: [
      { id: 'ing-spr-1', name: 'Carbonated Water', purpose: 'Base', riskLevel: 'safe', regulatoryStatusIndia: 'FSSAI Approved', scientificContext: 'Water & carbon dioxide.' },
      { id: 'ing-spr-2', name: 'Sugar', purpose: 'Sweetener', riskLevel: 'high', regulatoryStatusIndia: 'FSSAI Standard', scientificContext: '11.8g sugar/100ml.' },
      { id: 'ing-spr-3', name: 'Acidity Regulator (INS 330, INS 331)', insNumber: 'INS 330', purpose: 'Citric acid tang', riskLevel: 'safe', regulatoryStatusIndia: 'FSSAI Approved', scientificContext: 'Citric acid & sodium citrate.' }
    ],
    nutritionFacts: [
      { nutrient: 'Energy', amountPer100g: '48 kcal', flag: 'moderate' },
      { nutrient: 'Sugars', amountPer100g: '11.8 g', flag: 'excessive' },
      { nutrient: 'Total Fat', amountPer100g: '0.0 g', flag: 'low' }
    ],
    regulatoryNotices: [
      { authority: 'FSSAI', standardCode: 'Lic. 10012011000620', status: 'Compliant', summary: 'FSSAI compliant.' }
    ],
    scientificEvidence: [],
    geminiExplainer: {
      theBigPicture: 'Caffeine-free and free of dark caramel dyes, but has the highest sugar among commercial soft drinks (nearly 12%).',
      whyThisGrade: ['Extreme free sugar (11.8g/100ml)', 'Caffeine-free advantage', 'Clear without synthetic caramel color'],
      suggestedQuestions: ['Is Sprite healthier than dark colas?']
    }
  },
  {
    id: 'prod-real-mixed-fruit-18',
    barcode: '8901888006363',
    name: 'Real Fruit Power Mixed Fruit Juice (180 ml)',
    brand: 'Real Fruit Power (Dabur)',
    category: 'food',
    categoryLabel: 'Soft Drinks & Juices',
    imageUrl: 'https://images.unsplash.com/photo-1621506289937-a8e4df240d0b?auto=format&fit=crop&w=600&q=80',
    packSize: '180 ml Tetra Pack (₹20)',
    grade: 'D',
    gradeScore: 30,
    summary: 'Contains 40% fruit juice content with 10.1g total sugars (6g added sugar) per 100ml. Formulated with INS 330, INS 440, INS 160a, INS 300, and INS 960.',
    ingredients: [
      { id: 'ing-real-1', name: 'Water', purpose: 'Vehicle', riskLevel: 'safe', regulatoryStatusIndia: 'FSSAI Standard', scientificContext: 'Purified water.' },
      { id: 'ing-real-2', name: 'Concentrated Mixed Fruit Juice (8.2%) [Apple, Orange, Guava, Apricot, Mango, Banana, Lime, Passion Fruit, Pineapple]', purpose: 'Fruit pulp concentrate', riskLevel: 'safe', regulatoryStatusIndia: 'FSSAI Approved', scientificContext: 'Natural fruit purees & concentrates.' },
      { id: 'ing-real-3', name: 'Sugar', purpose: 'Sweetener', riskLevel: 'high', regulatoryStatusIndia: 'FSSAI Standard', scientificContext: '6.0g added sugar per 100ml (18% RDA per serve).' },
      { id: 'ing-real-4', name: 'Acidity Regulator (INS 330)', insNumber: 'INS 330', purpose: 'Acidity regulator', riskLevel: 'safe', regulatoryStatusIndia: 'FSSAI Approved', scientificContext: 'Citric acid.' },
      { id: 'ing-real-5', name: 'Stabilizer (INS 440)', insNumber: 'INS 440', purpose: 'Texture & suspension', riskLevel: 'safe', regulatoryStatusIndia: 'FSSAI Approved', scientificContext: 'Pectin.' },
      { id: 'ing-real-6', name: 'Flavours (Natural & Nature Identical Substances)', purpose: 'Flavouring', riskLevel: 'moderate', regulatoryStatusIndia: 'FSSAI Standard', scientificContext: 'Mixed fruit aroma.' },
      { id: 'ing-real-7', name: 'Colour [INS 160a (ii) & (iii)]', insNumber: 'INS 160a', purpose: 'Natural carotenes colour', riskLevel: 'safe', regulatoryStatusIndia: 'FSSAI Approved', scientificContext: 'Beta-carotenes.' },
      { id: 'ing-real-8', name: 'Antioxidant (INS 300)', insNumber: 'INS 300', purpose: 'Vitamin C & Antioxidant', riskLevel: 'safe', regulatoryStatusIndia: 'FSSAI Approved', scientificContext: 'Ascorbic acid (18 mg/100ml).' },
      { id: 'ing-real-9', name: 'Sweetener (INS 960)', insNumber: 'INS 960', purpose: 'Non-caloric sweetener', riskLevel: 'moderate', regulatoryStatusIndia: 'FSSAI Permitted', scientificContext: 'Steviol Glycosides.' }
    ],
    nutritionFacts: [
      { nutrient: 'Energy', amountPer100g: '42 kcal (176 kJ)', flag: 'moderate' },
      { nutrient: 'Carbohydrates', amountPer100g: '10.1 g', flag: 'moderate' },
      { nutrient: 'Total Sugars', amountPer100g: '10.1 g', flag: 'excessive' },
      { nutrient: 'Added Sugars', amountPer100g: '6.0 g', dailyValuePercentage: '18% RDA', flag: 'excessive' },
      { nutrient: 'Natural Fruit Sugars', amountPer100g: '4.1 g', flag: 'low' },
      { nutrient: 'Protein', amountPer100g: '0.2 g', flag: 'low' },
      { nutrient: 'Total Fat', amountPer100g: '0.0 g', flag: 'low' },
      { nutrient: 'Saturated Fat', amountPer100g: '0.0 g', flag: 'low' },
      { nutrient: 'Sodium', amountPer100g: '4.7 mg', dailyValuePercentage: '0.4% RDA', flag: 'low' },
      { nutrient: 'Vitamin C', amountPer100g: '18.0 mg', dailyValuePercentage: '33.8% RDA', flag: 'low' },
      { nutrient: 'Potassium', amountPer100g: '50.0 mg', dailyValuePercentage: '2.1% RDA', flag: 'low' },
      { nutrient: 'Calcium', amountPer100g: '3.2 mg', dailyValuePercentage: '0.5% RDA', flag: 'low' },
      { nutrient: 'Iron', amountPer100g: '0.2 mg', dailyValuePercentage: '1.6% RDA', flag: 'low' },
      { nutrient: 'Fruit Juice Content', amountPer100g: '40 %', flag: 'moderate' }
    ],
    regulatoryNotices: [
      { authority: 'FSSAI', standardCode: 'Lic. 10012011000618', status: 'Compliant', summary: 'Dabur India Ltd registered manufacturing license.' },
      { authority: 'FSSAI', standardCode: 'FSS (Advertising & Claims) Reg.', status: 'Warning', summary: 'Contains 6g added refined sugar per 100ml. High liquid sugar penalty applied.' }
    ],
    scientificEvidence: [],
    geminiExplainer: {
      theBigPicture: 'Contains 40% fruit juice content with natural Vitamin C (18mg) and Potassium (50mg), but packs 10.1g total sugars (including 6g added sugar) per 100ml.',
      whyThisGrade: [
        'High sugar penalty: 10.1 g/100 ml total sugars (6g added sugar) exceeds healthy liquid benchmarks',
        'Contains 18mg Vitamin C (33.8% RDA) and 50mg Potassium',
        'Zero palm oil and zero saturated fat'
      ],
      suggestedQuestions: ['How much added sugar is in one 180ml pack of Real Fruit Juice?', 'Is Real Fruit Juice better than soft drinks like Coke?']
    }
  },
  {
    id: 'prod-nestle-cerelac-rice-india',
    barcode: '8901058000000',
    name: 'Nestle Cerelac Rice (India)',
    brand: 'Nestle',
    category: 'food',
    categoryLabel: 'Infant Cereal',
    targetAge: '6-24 months',
    imageUrl: 'https://images.unsplash.com/photo-1584308666744-24d5c474f2ae?auto=format&fit=crop&w=600&q=80',
    packSize: '300g (₹250)',
    grade: 'D',
    gradeScore: 35,
    summary: 'Nestle Cerelac Rice baby cereal formulated with rice flour, milk solids, soybean oil, and 16g sugar per 100g. Requires monitoring for inorganic arsenic exposure.',
    ingredients: [
      { id: 'ing-cerelac-1', name: 'Rice Flour', purpose: 'Grain base', riskLevel: 'moderate', regulatoryStatusIndia: 'FSSAI Infant Food Standard', scientificContext: 'Naturally absorbs inorganic arsenic from paddy soil.' },
      { id: 'ing-cerelac-2', name: 'Milk Solids', purpose: 'Protein & dairy nutrition', riskLevel: 'safe', regulatoryStatusIndia: 'FSSAI Approved', scientificContext: 'Contains dairy lactose and milk proteins (potential allergen).' },
      { id: 'ing-cerelac-3', name: 'Soybean Oil', purpose: 'Essential fatty acids', riskLevel: 'safe', regulatoryStatusIndia: 'FSSAI Standard', scientificContext: 'Polyunsaturated plant lipid.' },
      { id: 'ing-cerelac-4', name: 'Dibasic Potassium Phosphate', insNumber: 'INS 340(ii)', purpose: 'Acidity regulator & nutrient buffer', riskLevel: 'moderate', regulatoryStatusIndia: 'FSSAI Permitted in infant formulas', scientificContext: 'Inorganic phosphorus buffering salt.' },
      { id: 'ing-cerelac-5', name: 'Alpha Amylase', purpose: 'Starch digestion enzyme', riskLevel: 'safe', regulatoryStatusIndia: 'FSSAI Approved enzyme', scientificContext: 'Breaks complex rice starches into simpler digestible maltodextrins.' }
    ],
    nutritionFacts: [
      { nutrient: 'Energy', amountPer100g: '432 kcal', flag: 'moderate' },
      { nutrient: 'Protein', amountPer100g: '15.0 g', flag: 'low' },
      { nutrient: 'Carbohydrates', amountPer100g: '65.0 g', flag: 'moderate' },
      { nutrient: 'Total Sugars', amountPer100g: '16.0 g', flag: 'excessive' },
      { nutrient: 'Total Fat', amountPer100g: '10.0 g', flag: 'moderate' }
    ],
    chemicalContaminants: [
      { name: 'Inorganic Arsenic', measuredValueMgKg: null, riskLevel: 'UNVERIFIED' },
      { name: 'Lead', measuredValueMgKg: null, riskLevel: 'UNVERIFIED' },
      { name: 'Cadmium', measuredValueMgKg: null, riskLevel: 'UNVERIFIED' },
      { name: 'Mercury', measuredValueMgKg: null, riskLevel: 'UNVERIFIED' }
    ],
    regulatoryNotices: [
      { authority: 'FSSAI', standardCode: 'FSS (Foods for Infant Nutrition) Reg. 2020', status: 'Warning', summary: 'High sugar density for infant food (16g/100g). WHO European standard recommends 0g added sugar.' },
      { authority: 'WHO', standardCode: 'Guideline on sugars intake for adults and children', status: 'Warning', summary: 'Added sugars not recommended for infants under 24 months.' }
    ],
    scientificEvidence: [
      {
        id: 'study-cerelac-arsenic',
        title: 'Arsenic in baby foods: Dietary exposure and risk assessment',
        journal: 'Food and Chemical Toxicology',
        year: 2023,
        findingSummary: 'Rice crops bioaccumulate arsenic 10x faster than other cereals; infant formula requires strict batch certification.'
      }
    ],
    geminiExplainer: {
      theBigPicture: 'Infant cereal with 16g sugar per 100g. Public Eye investigation highlighted higher sugar in Indian Cerelac formulations vs European versions.',
      whyThisGrade: [
        'Infant food requires strict monitoring of sugar (16g/100g exceeds infant benchmarks)',
        'Rice-based cereal warrants attention to soil inorganic arsenic exposure',
        'Contains milk solids (potential allergen)',
        'Should be consumed as part of a diverse complementary diet'
      ],
      suggestedQuestions: [
        'Does Indian Cerelac contain more sugar than Cerelac in Europe?',
        'How can I test baby food for inorganic arsenic?',
        'What are healthier homemade baby food alternatives to Cerelac?'
      ]
    }
  },

  // ── PACKAGED MINERAL & DRINKING WATER ─────────────────────────────────────────
  {
    id: 'prod-bisleri-1l-19',
    barcode: '8906017290019',
    name: 'Bisleri Mineral Water with Added Minerals (1L)',
    brand: 'Bisleri',
    category: 'food',
    categoryLabel: 'Packaged Drinking Water',
    imageUrl: 'https://images.unsplash.com/photo-1548839140-29a749e1bc4e?auto=format&fit=crop&w=600&q=80',
    packSize: '1L Bottle (₹20)',
    grade: 'A',
    gradeScore: 100,
    summary: 'Purified mineral water treated with a 10-stage purification process, ozonation, and remineralized with magnesium and potassium.',
    ingredients: [
      { id: 'ing-bis-1', name: 'Treated Drinking Water', purpose: 'Hydration', riskLevel: 'safe', regulatoryStatusIndia: 'IS 14543 Certified', scientificContext: '10-stage RO & micron filtration.' },
      { id: 'ing-bis-2', name: 'Magnesium Sulphate', purpose: 'Essential mineral addition', riskLevel: 'safe', regulatoryStatusIndia: 'BIS Permitted Mineral', scientificContext: 'Supports muscle and metabolic function.' },
      { id: 'ing-bis-3', name: 'Potassium Bicarbonate', purpose: 'Electrolyte balance', riskLevel: 'safe', regulatoryStatusIndia: 'BIS Permitted Mineral', scientificContext: 'Maintains isotonic intracellular electrolyte balance.' }
    ],
    nutritionFacts: [
      { nutrient: 'Energy', amountPer100g: '0 kcal', flag: 'low' },
      { nutrient: 'Sugars', amountPer100g: '0.0 g', flag: 'low' },
      { nutrient: 'Total Fat', amountPer100g: '0.0 g', flag: 'low' },
      { nutrient: 'Sodium', amountPer100g: '0 mg', flag: 'low' },
      { nutrient: 'Magnesium', amountPer100g: '0.2 mg', flag: 'low' },
      { nutrient: 'Potassium', amountPer100g: '0.1 mg', flag: 'low' }
    ],
    regulatoryNotices: [
      { authority: 'BIS', standardCode: 'IS 14543:2004', status: 'Compliant', summary: 'Bureau of Indian Standards Packaged Drinking Water certified.' },
      { authority: 'FSSAI', standardCode: 'Lic. 10013022001539', status: 'Compliant', summary: 'Bisleri International certified facility.' }
    ],
    scientificEvidence: [],
    geminiExplainer: {
      theBigPicture: 'Pure, zero-calorie cellular hydration with added essential minerals. Ranked Grade A.',
      whyThisGrade: ['Zero sugar, zero fat, zero harmful chemicals', 'IS 14543 Bureau of Indian Standards certified', 'Remineralized with magnesium and potassium'],
      suggestedQuestions: ['What is the difference between RO water and packaged mineral water?']
    }
  },
  {
    id: 'prod-kinley-1l-20',
    barcode: '8901764051017',
    name: 'Kinley Packaged Drinking Water with Added Minerals (1L)',
    brand: 'Kinley (Coca-Cola)',
    category: 'food',
    categoryLabel: 'Packaged Drinking Water',
    imageUrl: 'https://images.unsplash.com/photo-1548839140-29a749e1bc4e?auto=format&fit=crop&w=600&q=80',
    packSize: '1L Bottle (₹20)',
    grade: 'A',
    gradeScore: 100,
    summary: 'Packaged drinking water subjected to reverse osmosis purification and fortified with sodium and magnesium salts.',
    ingredients: [
      { id: 'ing-kin-1', name: 'Treated Water', purpose: 'Hydration', riskLevel: 'safe', regulatoryStatusIndia: 'IS 14543 Compliant', scientificContext: 'Purified water.' },
      { id: 'ing-kin-2', name: 'Added Salts (Magnesium Sulphate, Sodium Chloride)', purpose: 'Taste & mineral replenishment', riskLevel: 'safe', regulatoryStatusIndia: 'BIS Certified', scientificContext: 'Essential trace minerals.' }
    ],
    nutritionFacts: [
      { nutrient: 'Energy', amountPer100g: '0 kcal', flag: 'low' },
      { nutrient: 'Sugars', amountPer100g: '0.0 g', flag: 'low' },
      { nutrient: 'Total Fat', amountPer100g: '0.0 g', flag: 'low' }
    ],
    regulatoryNotices: [
      { authority: 'BIS', standardCode: 'IS 14543:2004', status: 'Compliant', summary: 'BIS quality mark verified.' }
    ],
    scientificEvidence: [],
    geminiExplainer: {
      theBigPicture: 'Clean, safe hydration certified by BIS with zero calories and zero additives.',
      whyThisGrade: ['Grade A clean score', 'Safe reverse osmosis water', 'No sugar or calories'],
      suggestedQuestions: ['Does Kinley water have plastic microplastics?']
    }
  },

  // ── NOODLES & INSTANT FOOD ────────────────────────────────────────────────────
  {
    id: 'prod-yippee-noodles-21',
    barcode: '8901725131011',
    name: 'Sunfeast YiPPee! Magic Masala Noodles',
    brand: 'Sunfeast (ITC)',
    category: 'food',
    categoryLabel: 'Instant Noodles & Pasta',
    imageUrl: 'https://images.unsplash.com/photo-1612927601601-6638404737ce?auto=format&fit=crop&w=600&q=80',
    packSize: '70g (₹14)',
    grade: 'D',
    gradeScore: 28,
    summary: 'Round instant noodle cake pre-fried in palm oil with spicy masala tastemaker carrying 1120mg sodium.',
    ingredients: [
      { id: 'ing-yp-1', name: 'Wheat Flour (Maida)', purpose: 'Noodle cake', riskLevel: 'moderate', regulatoryStatusIndia: 'FSSAI Approved', scientificContext: 'Refined wheat flour.' },
      { id: 'ing-yp-2', name: 'Refined Palm Oil', purpose: 'Pre-frying oil', riskLevel: 'high', regulatoryStatusIndia: 'FSSAI Declared', scientificContext: 'Industrial flash frying medium.' },
      { id: 'ing-yp-3', name: 'Dehydrated Vegetables & Spices', purpose: 'Tastemaker seasoning', riskLevel: 'safe', regulatoryStatusIndia: 'FSSAI Approved', scientificContext: 'Carrot, cabbage, onion, turmeric.' },
      { id: 'ing-yp-4', name: 'Iodised Salt (Tastemaker)', purpose: 'Seasoning', riskLevel: 'high', regulatoryStatusIndia: 'FSSAI Standard', scientificContext: '1120mg sodium per 100g.' }
    ],
    nutritionFacts: [
      { nutrient: 'Energy', amountPer100g: '465 kcal', flag: 'excessive' },
      { nutrient: 'Saturated Fat', amountPer100g: '9.2 g', flag: 'excessive' },
      { nutrient: 'Total Fat', amountPer100g: '20.0 g', flag: 'excessive' },
      { nutrient: 'Sodium', amountPer100g: '1120 mg', flag: 'excessive' },
      { nutrient: 'Protein', amountPer100g: '9.0 g', flag: 'moderate' }
    ],
    regulatoryNotices: [
      { authority: 'FSSAI', standardCode: 'Lic. 10012031000312', status: 'Compliant', summary: 'ITC Limited registered facility.' }
    ],
    scientificEvidence: [],
    geminiExplainer: {
      theBigPicture: 'One pack exhausts over 50% of your daily sodium allowance while delivering 9.2g of saturated palm fat.',
      whyThisGrade: ['Extremely high sodium (1120mg)', 'Palm oil flash-frying penalty', 'High refined carbohydrates'],
      suggestedQuestions: ['How does YiPPee compare to Maggi in sodium and palm oil?']
    }
  },
  {
    id: 'prod-kitkat-22',
    barcode: '8901058852334',
    name: 'Nestlé KitKat 4-Finger Milk Chocolate Wafer',
    brand: 'Nestlé',
    category: 'food',
    categoryLabel: 'Chocolates & Confectionery',
    imageUrl: 'https://images.unsplash.com/photo-1549007994-cb92caebd54b?auto=format&fit=crop&w=600&q=80',
    packSize: '37.3g (₹25)',
    grade: 'D',
    gradeScore: 32,
    summary: 'Crisp wafer fingers enrobed in milk chocolate. Contains 44g sugar/100g, wheat flour, and milk solids.',
    ingredients: [
      { id: 'ing-kk-1', name: 'Milk Chocolate (68.8%) [Sugar, Milk Solids, Cocoa Butter, Cocoa Solids]', purpose: 'Enrobing chocolate', riskLevel: 'moderate', regulatoryStatusIndia: 'FSSAI Standard', scientificContext: 'Real cocoa butter combined with refined sucrose.' },
      { id: 'ing-kk-2', name: 'Refined Wheat Flour (Maida)', purpose: 'Crispy wafer core', riskLevel: 'moderate', regulatoryStatusIndia: 'FSSAI Approved', scientificContext: 'Wafer flour.' },
      { id: 'ing-kk-3', name: 'Hydrogenated Vegetable Fats (Palm/Sesame)', purpose: 'Wafer crispness', riskLevel: 'high', regulatoryStatusIndia: 'FSSAI Declared', scientificContext: 'Contains fractionated vegetable fat.' }
    ],
    nutritionFacts: [
      { nutrient: 'Energy', amountPer100g: '518 kcal', flag: 'excessive' },
      { nutrient: 'Sugars', amountPer100g: '44.0 g', flag: 'excessive' },
      { nutrient: 'Saturated Fat', amountPer100g: '14.5 g', flag: 'excessive' },
      { nutrient: 'Total Fat', amountPer100g: '26.5 g', flag: 'excessive' },
      { nutrient: 'Protein', amountPer100g: '7.2 g', flag: 'moderate' }
    ],
    regulatoryNotices: [
      { authority: 'FSSAI', standardCode: 'Lic. 10012011000168', status: 'Compliant', summary: 'Nestle India compliant.' }
    ],
    scientificEvidence: [],
    geminiExplainer: {
      theBigPicture: 'Combines real milk chocolate with crispy wafers, but sugar is 44% by weight with vegetable fats in wafer.',
      whyThisGrade: ['44g sugar per 100g', 'Saturated fat 14.5g', 'High calorie density (518 kcal)'],
      suggestedQuestions: ['Is KitKat healthier than pure milk chocolate?']
    }
  },

  // ── FEMININE HYGIENE & SANITARY PADS ──────────────────────────────────────────
  {
    id: 'prod-stayfree-secure-23',
    barcode: '8901012117015',
    name: 'Stayfree Secure Cottony Soft Wings Sanitary Pads',
    brand: 'Stayfree (Johnson & Johnson)',
    category: 'women-hygiene',
    categoryLabel: "Women's Hygiene & Sanitary Pads",
    imageUrl: 'https://images.unsplash.com/photo-1584308666744-24d5c474f2ae?auto=format&fit=crop&w=600&q=80',
    packSize: 'Pack of 18 (₹95)',
    grade: 'C',
    gradeScore: 60,
    summary: 'Widely accessible conventional sanitary pad. Uses wood fluff pulp core, superabsorbent polymer, and synthetic cover with fragrance.',
    ingredients: [
      { id: 'ing-sf-1', name: 'Wood Pulp Fluff Core', purpose: 'Absorbent core', riskLevel: 'moderate', regulatoryStatusIndia: 'IS 5405 Approved', scientificContext: 'Chlorine-bleached cellulose fluff.' },
      { id: 'ing-sf-2', name: 'Sodium Polyacrylate (SAP)', purpose: 'Fluid gel lock', riskLevel: 'safe', regulatoryStatusIndia: 'IS 5405 Permitted', scientificContext: 'Superabsorbent polymer.' },
      { id: 'ing-sf-3', name: 'Polypropylene Non-woven Topsheet', purpose: 'Soft cover', riskLevel: 'moderate', regulatoryStatusIndia: 'IS 5405 Approved', scientificContext: 'Synthetic plastic netting.' },
      { id: 'ing-sf-4', name: 'Synthetic Fragrance', purpose: 'Odor masking', riskLevel: 'high', regulatoryStatusIndia: 'Regulatory Flag', scientificContext: 'Synthetic fragrance; potential allergen for sensitive vulvar mucosa.' }
    ],
    regulatoryNotices: [
      { authority: 'BIS', standardCode: 'IS 5405:2019', status: 'Compliant', summary: 'Complies with Indian Sanitary Napkins specification.' }
    ],
    scientificEvidence: [],
    hygieneMetrics: {
      coreMaterial: 'Cellulose Wood Fluff Pulp + SAP',
      bleachingProcess: 'Elemental Chlorine Free',
      dioxinRisk: 'Low',
      fragranceStatus: 'Synthetic Fragrance',
      plasticContentPercentage: 62,
      absorbencyTested: '35 ml (Overnight Capable)',
      skinIrritationIndex: 'Mild Irritant',
      bisStandardCompliance: 'IS 5405:2019 Certified'
    },
    geminiExplainer: {
      theBigPicture: 'Affordable and highly absorbent, but uses synthetic plastic topsheets and added fragrance that may irritate sensitive skin.',
      whyThisGrade: ['Absorbency meets BIS standard', 'Contains synthetic fragrance', '62% plastic content'],
      suggestedQuestions: ['Can scented pads cause vaginal infections or rashes?']
    }
  },
  {
    id: 'prod-sofy-antibacteria-24',
    barcode: '8903622001018',
    name: 'Sofy AntiBacteria Extra Long Overnight Pads',
    brand: 'Sofy (Unicharm)',
    category: 'women-hygiene',
    categoryLabel: "Women's Hygiene & Sanitary Pads",
    imageUrl: 'https://images.unsplash.com/photo-1584308666744-24d5c474f2ae?auto=format&fit=crop&w=600&q=80',
    packSize: 'Pack of 14 (₹140)',
    grade: 'B',
    gradeScore: 78,
    summary: 'Formulated with an antibacterial green sheet using natural tree bark extract, providing 99.9% bacterial protection with ECF bleaching.',
    ingredients: [
      { id: 'ing-sofy-1', name: 'Antibacterial Green Sheet (Tree Bark Extract)', purpose: 'Bacterial suppression', riskLevel: 'safe', regulatoryStatusIndia: 'IS 5405 Approved', scientificContext: 'Natural catechin antibacterial agent.' },
      { id: 'ing-sofy-2', name: 'Wood Fluff Pulp Core (ECF)', purpose: 'Core absorption', riskLevel: 'safe', regulatoryStatusIndia: 'IS 5405 Certified', scientificContext: 'Elemental chlorine-free bleaching.' },
      { id: 'ing-sofy-3', name: 'Deep Absorbent Sheet', purpose: 'Rapid fluid trapping', riskLevel: 'safe', regulatoryStatusIndia: 'IS 5405 Certified', scientificContext: 'Multi-layer distribution.' }
    ],
    regulatoryNotices: [
      { authority: 'BIS', standardCode: 'IS 5405:2019', status: 'Compliant', summary: 'Certified under Bureau of Indian Standards.' }
    ],
    scientificEvidence: [],
    hygieneMetrics: {
      coreMaterial: 'ECF Bleached Cellulose + Natural Bark Extract',
      bleachingProcess: 'Elemental Chlorine Free',
      dioxinRisk: 'Undetectable (<0.01ppt)',
      fragranceStatus: 'Unscented / Hypoallergenic',
      plasticContentPercentage: 45,
      absorbencyTested: '45 ml (Heavy Overnight)',
      skinIrritationIndex: 'Dermatologically Approved',
      bisStandardCompliance: 'IS 5405:2019 Certified'
    },
    geminiExplainer: {
      theBigPicture: 'Features proven antibacterial suppression without synthetic perfumes, using ECF bleached pulp.',
      whyThisGrade: ['Antibacterial sheet with 99.9% protection', 'Unscented and hypoallergenic', 'Elemental chlorine-free bleaching'],
      suggestedQuestions: ['How does the Sofy antibacterial sheet work?']
    }
  },
  {
    id: 'prod-nua-organic-25',
    barcode: '8908011244018',
    name: 'Nua Ultra Safe Organic Cotton Sanitary Pads',
    brand: 'Nua',
    category: 'women-hygiene',
    categoryLabel: "Women's Hygiene & Sanitary Pads",
    imageUrl: 'https://images.unsplash.com/photo-1584308666744-24d5c474f2ae?auto=format&fit=crop&w=600&q=80',
    packSize: 'Pack of 12 (₹199)',
    grade: 'A',
    gradeScore: 96,
    summary: '100% certified organic cotton topsheet, Total Chlorine Free (TCF), zero toxins, and 0% synthetic perfume.',
    ingredients: [
      { id: 'ing-nua-1', name: '100% Certified Organic Cotton', purpose: 'Pure contact topsheet', riskLevel: 'safe', regulatoryStatusIndia: 'GOTS Certified & IS 5405', scientificContext: 'Zero pesticides, non-irritating natural fiber.' },
      { id: 'ing-nua-2', name: 'Totally Chlorine Free (TCF) Fluff Core', purpose: 'Absorbent core', riskLevel: 'safe', regulatoryStatusIndia: 'TCF Certified', scientificContext: 'Bleached via oxygen/ozone, zero dioxin contamination.' },
      { id: 'ing-nua-3', name: 'Breathable Bioplastic Backing', purpose: 'Leakproof barrier', riskLevel: 'safe', regulatoryStatusIndia: 'IS 5405 Certified', scientificContext: 'Allows air circulation, preventing contact dermatitis.' }
    ],
    regulatoryNotices: [
      { authority: 'BIS', standardCode: 'IS 5405:2019', status: 'Compliant', summary: 'Gold standard safety compliance.' }
    ],
    scientificEvidence: [],
    hygieneMetrics: {
      coreMaterial: '100% GOTS Organic Cotton + TCF Pulp',
      bleachingProcess: 'Total Chlorine Free (TCF)',
      dioxinRisk: 'Undetectable (<0.01ppt)',
      fragranceStatus: 'Unscented / Hypoallergenic',
      plasticContentPercentage: 8,
      absorbencyTested: '40 ml',
      skinIrritationIndex: 'Hypoallergenic',
      bisStandardCompliance: 'IS 5405:2019 Certified'
    },
    geminiExplainer: {
      theBigPicture: 'Medical-grade menstrual hygiene with 100% organic cotton, zero chlorine bleaching, and no fragrances.',
      whyThisGrade: ['Grade A cleanest rating', 'Zero synthetic fragrance or chemical bleaches', 'Certified organic cotton topsheet'],
      suggestedQuestions: ['Why is Total Chlorine Free (TCF) important for sanitary pads?']
    }
  }
];

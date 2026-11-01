const { MongoClient } = require("mongodb");
require("dotenv").config({ path: "/home/kalu/Coding/checkpoint.hackcbs9.0/backend/.env" });

const uri = process.env.MONGODB_URI;

const MONGO_UPDATES = [
  // ── Kurkure Masala Munch ────────────────────────────────────────────────
  {
    barcode: "8901491101837",
    productId: "kurkure-masala-munch-75g",
    name: "Kurkure Masala Munch Crisps",
    brand: "Kurkure (PepsiCo)",
    category: "SNACKS",
    subCategory: "NAMKEEN / EXTRUDED SNACKS",
    priceINR: 20,
    servingSizeG: 75,
    palmOil: true,
    palmOilStatus: "confirmed",
    ingredientsText: "Rice Meal (43.5%), Edible Vegetable Oil (Palmolein), Corn Meal (20.0%), Gram Meal (3.6%), Seasoning (Spices and Condiments, Iodised Salt, Sugar, Flavour (Natural and Nature Identical Flavouring Substances), Acidity Regulator (INS 330), Flavour Enhancers (INS 627, INS 631)).",
    ingredients: [
      "Rice Meal (43.5%)",
      "Edible Vegetable Oil (Palmolein)",
      "Corn Meal (20.0%)",
      "Gram Meal (3.6%)",
      "Spices and Condiments",
      "Iodised Salt",
      "Sugar",
      "Acidity Regulator (INS 330)",
      "Flavour Enhancer (INS 627)",
      "Flavour Enhancer (INS 631)"
    ],
    nutrition: {
      caloriesKcal: 561,
      energyKj: 2347,
      carbs: 55.4,
      sugars: 1.5,
      addedSugars: 0.0,
      naturalSugars: 1.5,
      protein: 6.2,
      totalFat: 35.0,
      satFat: 15.8,
      transFat: 0.1,
      cholesterolMg: 0.0,
      sodiumMg: 840,
      fibre: 2.2,
      calciumMg: 14,
      potassiumMg: 180,
      ironMg: 1.1,
      fruitVegPct: 0
    },
    rating: {
      grade: "E",
      score: 14,
      color: "Deep Red",
      reasons: [
        "Palmolein oil used as frying medium (>35% oil content)",
        "High saturated fat (15.8g per 100g)",
        "Excessive sodium (840mg per 100g)"
      ],
      additivesFlagged: ["INS 627", "INS 631", "INS 330"]
    },
    fssaiLicense: "10012011000109"
  },

  // ── Kurkure Chilli Chatka ────────────────────────────────────────────────
  {
    barcode: "8901491102834",
    productId: "kurkure-chilli-chatka-75g",
    name: "Kurkure Chilli Chatka Crisps",
    brand: "Kurkure (PepsiCo)",
    category: "SNACKS",
    subCategory: "NAMKEEN / EXTRUDED SNACKS",
    priceINR: 20,
    servingSizeG: 75,
    palmOil: true,
    palmOilStatus: "confirmed",
    ingredientsText: "Rice Meal, Edible Vegetable Oil (Palmolein), Corn Meal, Gram Meal, Seasoning (Iodised Salt, Chilli Seasoning, Spices & Condiments, Sugar, Acidity Regulator (INS 330), Flavour Enhancers (INS 627, INS 631)).",
    ingredients: [
      "Rice Meal",
      "Edible Vegetable Oil (Palmolein)",
      "Corn Meal",
      "Gram Meal",
      "Iodised Salt",
      "Chilli Seasoning",
      "Acidity Regulator (INS 330)",
      "Flavour Enhancer (INS 627)",
      "Flavour Enhancer (INS 631)"
    ],
    nutrition: {
      caloriesKcal: 558,
      energyKj: 2334,
      carbs: 56.0,
      sugars: 2.0,
      addedSugars: 0.0,
      naturalSugars: 2.0,
      protein: 6.0,
      totalFat: 34.5,
      satFat: 15.5,
      transFat: 0.1,
      cholesterolMg: 0.0,
      sodiumMg: 890,
      fibre: 2.0,
      calciumMg: 12,
      potassiumMg: 175,
      ironMg: 1.2,
      fruitVegPct: 0
    },
    rating: {
      grade: "E",
      score: 12,
      color: "Deep Red",
      reasons: [
        "Deep fried in palmolein oil",
        "High saturated fat (15.5g per 100g)",
        "Excessive sodium (890mg per 100g)"
      ],
      additivesFlagged: ["INS 627", "INS 631", "INS 330"]
    },
    fssaiLicense: "10012011000109"
  },

  // ── Pepsi Soft Drink ─────────────────────────────────────────────────────
  {
    barcode: "8901491100014",
    productId: "pepsi-can-250ml",
    name: "Pepsi Carbonated Soft Drink",
    brand: "Pepsi (PepsiCo)",
    category: "BEVERAGE",
    subCategory: "CARBONATED WATER / COLA",
    priceINR: 20,
    servingSizeG: 250,
    palmOil: false,
    palmOilStatus: "not_detected",
    ingredientsText: "Carbonated Water, Sugar, Acidity Regulator (INS 338), Colour (INS 150d), Flavour (Natural Flavouring Substances), Caffeine.",
    ingredients: [
      "Carbonated Water",
      "Sugar",
      "Acidity Regulator (INS 338)",
      "Colour (INS 150d)",
      "Natural Flavouring Substances",
      "Caffeine"
    ],
    nutrition: {
      caloriesKcal: 43,
      energyKj: 180,
      carbs: 10.7,
      sugars: 10.7,
      addedSugars: 10.7,
      naturalSugars: 0.0,
      protein: 0.0,
      totalFat: 0.0,
      satFat: 0.0,
      transFat: 0.0,
      cholesterolMg: 0.0,
      sodiumMg: 11.0,
      fibre: 0.0,
      potassiumMg: 4.0,
      caffeineMg: 10.0,
      fruitVegPct: 0
    },
    rating: {
      grade: "E",
      score: 10,
      color: "Deep Red",
      reasons: [
        "High liquid sugar (10.7g/100ml) exceeds beverage Nutri-Score thresholds",
        "Contains Phosphoric Acid (INS 338)",
        "Zero micronutrients or protein"
      ],
      additivesFlagged: ["INS 338", "INS 150d"]
    },
    fssaiLicense: "10012011000109"
  },

  // ── Coca-Cola Original ───────────────────────────────────────────────────
  {
    barcode: "8901764012216",
    productId: "coca-cola-can-250ml",
    name: "Coca-Cola Carbonated Beverage",
    brand: "Coca-Cola",
    category: "BEVERAGE",
    subCategory: "CARBONATED BEVERAGE",
    priceINR: 20,
    servingSizeG: 250,
    palmOil: false,
    palmOilStatus: "not_detected",
    ingredientsText: "Carbonated Water, Sugar, Acidity Regulator (INS 338), Colour (INS 150d), Flavours (Natural Flavouring Substances), Caffeine.",
    ingredients: [
      "Carbonated Water",
      "Sugar",
      "Acidity Regulator (INS 338)",
      "Colour (INS 150d)",
      "Natural Flavouring Substances",
      "Caffeine"
    ],
    nutrition: {
      caloriesKcal: 44,
      energyKj: 184,
      carbs: 10.6,
      sugars: 10.6,
      addedSugars: 10.6,
      naturalSugars: 0.0,
      protein: 0.0,
      totalFat: 0.0,
      satFat: 0.0,
      transFat: 0.0,
      cholesterolMg: 0.0,
      sodiumMg: 9.5,
      fibre: 0.0,
      potassiumMg: 2.5,
      caffeineMg: 9.7,
      fruitVegPct: 0
    },
    rating: {
      grade: "E",
      score: 10,
      color: "Deep Red",
      reasons: [
        "Liquid sugar (10.6g/100ml) triggers beverage Nutri-Score Grade E",
        "Contains Phosphoric Acid (INS 338) linked to enamel erosion",
        "Caramel Class IV (INS 150d)"
      ],
      additivesFlagged: ["INS 338", "INS 150d"]
    },
    fssaiLicense: "10012011000620"
  },

  // ── Coca-Cola Zero Sugar ─────────────────────────────────────────────────
  {
    barcode: "8901764032214",
    productId: "coca-cola-zero-300ml",
    name: "Coca-Cola Zero Sugar Soft Drink",
    brand: "Coca-Cola",
    category: "BEVERAGE",
    subCategory: "CARBONATED BEVERAGE / ZERO SUGAR",
    priceINR: 35,
    servingSizeG: 300,
    palmOil: false,
    palmOilStatus: "not_detected",
    ingredientsText: "Carbonated Water, Acidity Regulators (INS 338, INS 331(iii)), Sweeteners (INS 951, INS 950), Preservative (INS 211), Colour (INS 150d), Flavours, Caffeine.",
    ingredients: [
      "Carbonated Water",
      "Acidity Regulator (INS 338)",
      "Acidity Regulator (INS 331(iii))",
      "Sweetener (INS 951 - Aspartame)",
      "Sweetener (INS 950 - Acesulfame Potassium)",
      "Preservative (INS 211)",
      "Colour (INS 150d)",
      "Caffeine"
    ],
    nutrition: {
      caloriesKcal: 0.3,
      energyKj: 1.2,
      carbs: 0.0,
      sugars: 0.0,
      addedSugars: 0.0,
      naturalSugars: 0.0,
      protein: 0.0,
      totalFat: 0.0,
      satFat: 0.0,
      transFat: 0.0,
      cholesterolMg: 0.0,
      sodiumMg: 7.5,
      fibre: 0.0,
      potassiumMg: 12.0,
      caffeineMg: 9.6,
      fruitVegPct: 0
    },
    rating: {
      grade: "C",
      score: 55,
      color: "Yellow",
      reasons: [
        "Zero calories and zero sugars",
        "Contains artificial intense sweeteners (Aspartame & Acesulfame Potassium)",
        "Contains Phosphoric Acid (INS 338)"
      ],
      additivesFlagged: ["INS 951", "INS 950", "INS 338", "INS 211", "INS 150d"]
    },
    fssaiLicense: "10012011000620"
  },

  // ── Lay's Classic Salted ─────────────────────────────────────────────────
  {
    barcode: "8901491000833",
    productId: "lays-classic-salted-50g",
    name: "Lay's Classic Salted Potato Chips",
    brand: "Lay's (PepsiCo)",
    category: "SNACKS",
    subCategory: "POTATO CHIPS",
    priceINR: 20,
    servingSizeG: 50,
    palmOil: true,
    palmOilStatus: "confirmed",
    ingredientsText: "Potato (62%), Edible Vegetable Oil (Palmolein), Iodised Salt (1.5%).",
    ingredients: [
      "Potato (62%)",
      "Edible Vegetable Oil (Palmolein)",
      "Iodised Salt (1.5%)"
    ],
    nutrition: {
      caloriesKcal: 540,
      energyKj: 2259,
      carbs: 53.0,
      sugars: 0.5,
      addedSugars: 0.0,
      naturalSugars: 0.5,
      protein: 7.0,
      totalFat: 33.5,
      satFat: 14.0,
      transFat: 0.1,
      cholesterolMg: 0.0,
      sodiumMg: 540,
      fibre: 3.8,
      potassiumMg: 1270,
      calciumMg: 20,
      ironMg: 1.9,
      vitaminCMg: 14.0,
      fruitVegPct: 62
    },
    rating: {
      grade: "D",
      score: 26,
      color: "Orange",
      reasons: [
        "Palmolein oil used for deep frying; grade downgraded to D",
        "High saturated fat (14.0g per 100g)",
        "Good potassium content (1270mg from whole potatoes)"
      ],
      additivesFlagged: []
    },
    fssaiLicense: "10012011000109"
  },

  // ── Lay's American Style Cream & Onion ────────────────────────────────────
  {
    barcode: "8901491000857",
    productId: "lays-cream-and-onion-50g",
    name: "Lay's American Style Cream & Onion Chips",
    brand: "Lay's (PepsiCo)",
    category: "SNACKS",
    subCategory: "POTATO CHIPS",
    priceINR: 20,
    servingSizeG: 50,
    palmOil: true,
    palmOilStatus: "confirmed",
    ingredientsText: "Potato (52%), Edible Vegetable Oil (Palmolein), Seasoning (Milk Solids - Whey Powder, Skim Milk Powder, Cheese Powder, Onion Powder, Sugar, Iodised Salt, Flavour Enhancer (INS 627, INS 631), Acidity Regulator (INS 330)).",
    ingredients: [
      "Potato (52%)",
      "Edible Vegetable Oil (Palmolein)",
      "Milk Solids (Whey Powder, Skim Milk Powder, Cheese Powder)",
      "Onion Powder",
      "Sugar",
      "Iodised Salt",
      "Flavour Enhancer (INS 627)",
      "Flavour Enhancer (INS 631)",
      "Acidity Regulator (INS 330)"
    ],
    nutrition: {
      caloriesKcal: 542,
      energyKj: 2267,
      carbs: 53.2,
      sugars: 4.8,
      addedSugars: 3.5,
      naturalSugars: 1.3,
      protein: 6.8,
      totalFat: 33.8,
      satFat: 14.5,
      transFat: 0.1,
      cholesterolMg: 0.0,
      sodiumMg: 720,
      fibre: 3.2,
      potassiumMg: 1150,
      calciumMg: 28,
      ironMg: 1.6,
      fruitVegPct: 52
    },
    rating: {
      grade: "D",
      score: 24,
      color: "Orange",
      reasons: [
        "Deep fried in palmolein; grade downgraded to D",
        "High saturated fat (14.5g per 100g)",
        "High sodium (720mg per 100g)"
      ],
      additivesFlagged: ["INS 627", "INS 631", "INS 330"]
    },
    fssaiLicense: "10012011000109"
  },

  // ── Lay's India's Magic Masala ───────────────────────────────────────────
  {
    barcode: "8901491001014",
    productId: "lays-magic-masala-50g",
    name: "Lay's India's Magic Masala Potato Chips",
    brand: "Lay's (PepsiCo)",
    category: "SNACKS",
    subCategory: "POTATO CHIPS",
    priceINR: 20,
    servingSizeG: 50,
    palmOil: true,
    palmOilStatus: "confirmed",
    ingredientsText: "Potato (52%), Edible Vegetable Oil (Palmolein), Seasoning (Spices & Condiments, Iodised Salt, Sugar, Maltodextrin, Flavour (Natural and Nature Identical Flavouring Substances), Acidity Regulator (INS 330), Flavour Enhancers (INS 627, INS 631)).",
    ingredients: [
      "Potato (52%)",
      "Edible Vegetable Oil (Palmolein)",
      "Spices & Condiments",
      "Iodised Salt",
      "Sugar",
      "Maltodextrin",
      "Acidity Regulator (INS 330)",
      "Flavour Enhancer (INS 627)",
      "Flavour Enhancer (INS 631)"
    ],
    nutrition: {
      caloriesKcal: 544,
      energyKj: 2276,
      carbs: 52.8,
      sugars: 2.5,
      addedSugars: 1.8,
      naturalSugars: 0.7,
      protein: 6.9,
      totalFat: 34.0,
      satFat: 14.2,
      transFat: 0.1,
      cholesterolMg: 0.0,
      sodiumMg: 820,
      fibre: 3.5,
      potassiumMg: 1200,
      calciumMg: 22,
      ironMg: 1.8,
      fruitVegPct: 52
    },
    rating: {
      grade: "E",
      score: 16,
      color: "Deep Red",
      reasons: [
        "Palmolein oil deep frying",
        "Saturated fat exceeds 14g per 100g",
        "High sodium (820mg per 100g)"
      ],
      additivesFlagged: ["INS 627", "INS 631", "INS 330"]
    },
    fssaiLicense: "10012011000109"
  },

  // ── Parle-G ──────────────────────────────────────────────────────────────
  {
    barcode: "8901719101068",
    productId: "parle-g-gluco-80g",
    name: "Parle-G Original Gluco Biscuits",
    brand: "Parle",
    category: "BISCUIT",
    subCategory: "GLUCOSE BISCUIT",
    priceINR: 10,
    servingSizeG: 80,
    palmOil: true,
    palmOilStatus: "confirmed",
    ingredientsText: "Refined Wheat Flour (Maida) (67%), Sugar, Refined Palm Oil, Invert Sugar Syrup, Raising Agents [INS 503(ii), INS 500(ii)], Milk Solids, Iodised Salt, Emulsifiers [INS 322, INS 472e], Flavour.",
    ingredients: [
      "Refined Wheat Flour (Maida)",
      "Sugar",
      "Refined Palm Oil",
      "Invert Sugar Syrup",
      "Raising Agent (INS 503(ii))",
      "Raising Agent (INS 500(ii))",
      "Milk Solids",
      "Iodised Salt",
      "Emulsifier (INS 322)",
      "Emulsifier (INS 472e)"
    ],
    nutrition: {
      caloriesKcal: 454,
      energyKj: 1899,
      carbs: 78.2,
      sugars: 25.5,
      addedSugars: 24.5,
      naturalSugars: 1.0,
      protein: 6.5,
      totalFat: 13.0,
      satFat: 6.0,
      transFat: 0.0,
      cholesterolMg: 0.0,
      sodiumMg: 260,
      fibre: 1.5,
      calciumMg: 40,
      potassiumMg: 85,
      ironMg: 1.5,
      fruitVegPct: 0
    },
    rating: {
      grade: "D",
      score: 28,
      color: "Orange",
      reasons: [
        "High sugar (25.5g/100g) exceeds 14g threshold",
        "Refined Palm Oil detected (grade downgraded to D)",
        "Refined Maida flour base"
      ],
      additivesFlagged: ["INS 503(ii)", "INS 500(ii)", "INS 322", "INS 472e"]
    },
    fssaiLicense: "10013022002253"
  },

  // ── Britannia Good Day Butter ────────────────────────────────────────────
  {
    barcode: "8901063012013",
    productId: "britannia-good-day-butter-100g",
    name: "Britannia Good Day Butter Cookies",
    brand: "Britannia",
    category: "BISCUIT",
    subCategory: "BUTTER COOKIES",
    priceINR: 20,
    servingSizeG: 100,
    palmOil: true,
    palmOilStatus: "confirmed",
    ingredientsText: "Refined Wheat Flour (Maida), Sugar, Edible Vegetable Oil (Palm), Butter (2%), Invert Sugar Syrup, Milk Solids, Raising Agents [503(ii), 500(ii)], Iodised Salt, Emulsifiers [322, 471, 472e].",
    ingredients: [
      "Refined Wheat Flour (Maida)",
      "Sugar",
      "Edible Vegetable Oil (Palm)",
      "Butter (2%)",
      "Invert Sugar Syrup",
      "Milk Solids",
      "Raising Agent (503(ii))",
      "Raising Agent (500(ii))",
      "Iodised Salt",
      "Emulsifiers (322, 471, 472e)"
    ],
    nutrition: {
      caloriesKcal: 490,
      energyKj: 2050,
      carbs: 68.0,
      sugars: 23.0,
      addedSugars: 22.0,
      naturalSugars: 1.0,
      protein: 6.0,
      totalFat: 21.5,
      satFat: 10.5,
      transFat: 0.0,
      cholesterolMg: 3.5,
      sodiumMg: 220,
      fibre: 1.0,
      calciumMg: 32,
      potassiumMg: 78,
      ironMg: 1.2,
      fruitVegPct: 0
    },
    rating: {
      grade: "D",
      score: 22,
      color: "Orange",
      reasons: [
        "Formulated with palm oil as main fat with only 2% butter; grade downgraded to D",
        "High saturated fat (10.5g/100g)",
        "High sugar (23.0g/100g)"
      ],
      additivesFlagged: ["INS 503(ii)", "INS 500(ii)", "INS 322", "INS 471", "INS 472e"]
    },
    fssaiLicense: "10015043001129"
  },

  // ── Britannia Good Day Cashew ────────────────────────────────────────────
  {
    barcode: "8901058852341",
    productId: "britannia-good-day-cashew-100g",
    name: "Britannia Good Day Cashew Cookies",
    brand: "Britannia",
    category: "BISCUIT",
    subCategory: "NUT COOKIES",
    priceINR: 25,
    servingSizeG: 100,
    palmOil: true,
    palmOilStatus: "confirmed",
    ingredientsText: "Refined Wheat Flour (Maida), Sugar, Edible Vegetable Oil (Palm), Cashew Bits (4.5%), Butter, Invert Sugar Syrup, Milk Solids, Raising Agents [503(ii), 500(ii)], Iodised Salt, Emulsifiers [322, 471].",
    ingredients: [
      "Refined Wheat Flour (Maida)",
      "Sugar",
      "Edible Vegetable Oil (Palm)",
      "Cashew Bits (4.5%)",
      "Butter",
      "Invert Sugar Syrup",
      "Milk Solids",
      "Raising Agent (503(ii))",
      "Raising Agent (500(ii))",
      "Iodised Salt",
      "Emulsifiers (322, 471)"
    ],
    nutrition: {
      caloriesKcal: 501,
      energyKj: 2096,
      carbs: 67.0,
      sugars: 22.0,
      addedSugars: 21.0,
      naturalSugars: 1.0,
      protein: 7.0,
      totalFat: 23.0,
      satFat: 10.0,
      transFat: 0.0,
      cholesterolMg: 2.0,
      sodiumMg: 210,
      fibre: 1.2,
      calciumMg: 35,
      potassiumMg: 110,
      ironMg: 1.8,
      fruitVegPct: 0
    },
    rating: {
      grade: "D",
      score: 23,
      color: "Orange",
      reasons: [
        "Contains Refined Palm Oil; grade downgraded to D",
        "High sugar (22.0g/100g)",
        "Over 500 kcal per 100g"
      ],
      additivesFlagged: ["INS 503(ii)", "INS 500(ii)", "INS 322", "INS 471"]
    },
    fssaiLicense: "10015043001129"
  },

  // ── Britannia Marie Gold ─────────────────────────────────────────────────
  {
    barcode: "8901063011030",
    productId: "britannia-marie-gold-120g",
    name: "Britannia Marie Gold Biscuits",
    brand: "Britannia",
    category: "BISCUIT",
    subCategory: "TEA BISCUITS",
    priceINR: 15,
    servingSizeG: 120,
    palmOil: true,
    palmOilStatus: "confirmed",
    ingredientsText: "Refined Wheat Flour (Maida) (68%), Sugar, Refined Palm Oil, Invert Sugar Syrup, Milk Solids, Raising Agents [503(ii), 500(ii)], Iodised Salt, Dough Conditioner (INS 223), Emulsifier (INS 471).",
    ingredients: [
      "Refined Wheat Flour (Maida) (68%)",
      "Sugar",
      "Refined Palm Oil",
      "Invert Sugar Syrup",
      "Milk Solids",
      "Raising Agents [503(ii), 500(ii)]",
      "Iodised Salt",
      "Dough Conditioner (INS 223)",
      "Emulsifier (INS 471)"
    ],
    nutrition: {
      caloriesKcal: 446,
      energyKj: 1866,
      carbs: 78.0,
      sugars: 21.5,
      addedSugars: 20.0,
      naturalSugars: 1.5,
      protein: 8.0,
      totalFat: 11.5,
      satFat: 5.0,
      transFat: 0.0,
      cholesterolMg: 0.0,
      sodiumMg: 280,
      fibre: 2.5,
      calciumMg: 45,
      potassiumMg: 95,
      ironMg: 2.1,
      fruitVegPct: 0
    },
    rating: {
      grade: "D",
      score: 32,
      color: "Orange",
      reasons: [
        "Refined Palm Oil used as shortening; grade downgraded to D",
        "High sugar (21.5g per 100g)",
        "Refined maida base"
      ],
      additivesFlagged: ["INS 503(ii)", "INS 500(ii)", "INS 223", "INS 471"]
    },
    fssaiLicense: "10015043001129"
  },

  // ── Parle Hide & Seek ────────────────────────────────────────────────────
  {
    barcode: "8901719114251",
    productId: "parle-hide-and-seek-120g",
    name: "Parle Hide & Seek Chocolate Chip Cookies",
    brand: "Parle",
    category: "BISCUIT",
    subCategory: "CHOCOLATE COOKIES",
    priceINR: 30,
    servingSizeG: 120,
    palmOil: true,
    palmOilStatus: "confirmed",
    ingredientsText: "Refined Wheat Flour (Maida), Chocolate Chips (23%) [Sugar, Cocoa Mass, Cocoa Butter, Dextrose, Emulsifier (INS 322)], Sugar, Refined Palm Oil, Invert Sugar Syrup, Raising Agents [503(ii), 500(ii)], Iodised Salt, Emulsifiers [INS 472e].",
    ingredients: [
      "Refined Wheat Flour (Maida)",
      "Chocolate Chips (23%)",
      "Sugar",
      "Refined Palm Oil",
      "Invert Sugar Syrup",
      "Raising Agents [503(ii), 500(ii)]",
      "Iodised Salt",
      "Emulsifiers [INS 472e, INS 322]"
    ],
    nutrition: {
      caloriesKcal: 479,
      energyKj: 2004,
      carbs: 73.4,
      sugars: 32.5,
      addedSugars: 31.0,
      naturalSugars: 1.5,
      protein: 5.9,
      totalFat: 18.0,
      satFat: 9.4,
      transFat: 0.0,
      cholesterolMg: 0.0,
      sodiumMg: 114,
      fibre: 1.6,
      calciumMg: 28,
      potassiumMg: 160,
      ironMg: 3.2,
      fruitVegPct: 0
    },
    rating: {
      grade: "D",
      score: 20,
      color: "Orange",
      reasons: [
        "Very high sugar (32.5g per 100g)",
        "Refined Palm Oil shortening; grade downgraded to D",
        "Saturated fat 9.4g"
      ],
      additivesFlagged: ["INS 503(ii)", "INS 500(ii)", "INS 322", "INS 472e"]
    },
    fssaiLicense: "10013022002253"
  },

  // ── Britannia Nutrichoice Digestive ──────────────────────────────────────
  {
    barcode: "8901063012128",
    productId: "britannia-nutrichoice-digestive-100g",
    name: "Britannia Nutrichoice Digestive High-Fibre Biscuits",
    brand: "Britannia",
    category: "BISCUIT",
    subCategory: "DIGESTIVE BISCUIT",
    priceINR: 20,
    servingSizeG: 100,
    palmOil: true,
    palmOilStatus: "confirmed",
    ingredientsText: "Wheat Flour (Atta) (65.5%), Refined Palm Oil, Sugar, Wheat Bran (2.6%), Maltodextrin, Milk Solids, Whey Powder, Invert Sugar Syrup, Raising Agents [503(ii), 500(ii)], Iodised Salt, Emulsifiers [322(i), 471], Malt Extract.",
    ingredients: [
      "Wheat Flour (Atta) (65.5%)",
      "Refined Palm Oil",
      "Sugar",
      "Wheat Bran (2.6%)",
      "Maltodextrin",
      "Milk Solids",
      "Whey Powder",
      "Invert Sugar Syrup",
      "Raising Agents [503(ii), 500(ii)]",
      "Iodised Salt",
      "Emulsifiers [322(i), 471]",
      "Malt Extract"
    ],
    nutrition: {
      caloriesKcal: 483,
      energyKj: 2020,
      carbs: 68.0,
      sugars: 12.7,
      addedSugars: 11.5,
      naturalSugars: 1.2,
      protein: 9.3,
      totalFat: 20.8,
      satFat: 10.3,
      transFat: 0.0,
      cholesterolMg: 0.1,
      sodiumMg: 362,
      fibre: 6.7,
      calciumMg: 55,
      potassiumMg: 140,
      ironMg: 2.8,
      fruitVegPct: 0
    },
    rating: {
      grade: "D",
      score: 35,
      color: "Orange",
      reasons: [
        "Refined Palm Oil detected (10.3g saturated fat); grade downgraded to D",
        "High dietary fibre content (6.7g) from whole wheat",
        "Moderate sugar (12.7g)"
      ],
      additivesFlagged: ["INS 503(ii)", "INS 500(ii)", "INS 322(i)", "INS 471"]
    },
    fssaiLicense: "10015043001129"
  },

  // ── Sunfeast Dark Fantasy ────────────────────────────────────────────────
  {
    barcode: "8901725181223",
    productId: "80e210c69dd05557c833deb9", // keep existing ID to prevent unique index conflict
    name: "Sunfeast Dark Fantasy Choco Fills, Original Filled Cookies with Choco Crème",
    brand: "Sunfeast (ITC)",
    category: "BISCUIT",
    subCategory: "FILLED COOKIES",
    priceINR: 35,
    servingSizeG: 75,
    palmOil: true,
    palmOilStatus: "confirmed",
    ingredientsText: "Choco Crème (38%) [Sugar, Refined Palm Oil, Refined Palmolein, Cocoa Solids (5.3%), Emulsifier (INS 322)], Refined Wheat Flour (Maida), Hydrogenated Vegetable Oil, Sugar, Invert Sugar Syrup, Cocoa Solids (0.7%), Raising Agents [INS 500(ii), INS 503(ii)], Iodised Salt, Emulsifiers.",
    ingredients: [
      "Choco Crème (38%)",
      "Sugar",
      "Refined Palm Oil",
      "Refined Palmolein",
      "Cocoa Solids",
      "Refined Wheat Flour (Maida)",
      "Hydrogenated Vegetable Oil",
      "Invert Sugar Syrup",
      "Raising Agents [INS 500(ii), INS 503(ii)]",
      "Iodised Salt",
      "Emulsifiers"
    ],
    nutrition: {
      caloriesKcal: 507,
      energyKj: 2121,
      carbs: 61.1,
      sugars: 35.7,
      addedSugars: 34.5,
      naturalSugars: 1.2,
      protein: 7.3,
      totalFat: 27.3,
      satFat: 12.7,
      transFat: 0.1,
      cholesterolMg: 0.3,
      sodiumMg: 181.5,
      fibre: 2.0,
      calciumMg: 30,
      potassiumMg: 185,
      ironMg: 2.5,
      fruitVegPct: 0
    },
    rating: {
      grade: "E",
      score: 15,
      color: "Deep Red",
      reasons: [
        "Extremely high sugar (35.7g/100g)",
        "High saturated fat (12.7g/100g) from Palmolein and Palm Oil",
        "Hydrogenated vegetable oils present"
      ],
      additivesFlagged: ["INS 500(ii)", "INS 503(ii)", "INS 322"]
    },
    fssaiLicense: "10012031000312"
  },

  // ── Cadbury Oreo ─────────────────────────────────────────────────────────
  {
    barcode: "7622201740924",
    productId: "cadbury-oreo-vanilla-120g",
    name: "Cadbury Oreo Original Vanilla Creme Biscuits",
    brand: "Cadbury (Mondelez)",
    category: "BISCUIT",
    subCategory: "CREME BISCUITS",
    priceINR: 35,
    servingSizeG: 120,
    palmOil: true,
    palmOilStatus: "confirmed",
    ingredientsText: "Refined Wheat Flour (Maida), Sugar (38%), Edible Vegetable Fat and Palm Oil, Cocoa Solids (4.5%), Invert Sugar, Leavening Agents [500(ii), 503(ii)], Iodised Salt, Emulsifier (INS 322).",
    ingredients: [
      "Refined Wheat Flour (Maida)",
      "Sugar (38%)",
      "Fractionated Palm Oil",
      "Cocoa Solids (4.5%)",
      "Invert Sugar",
      "Leavening Agents [500(ii), 503(ii)]",
      "Iodised Salt",
      "Emulsifier (INS 322)"
    ],
    nutrition: {
      caloriesKcal: 483,
      energyKj: 2020,
      carbs: 70.5,
      sugars: 38.0,
      addedSugars: 37.0,
      naturalSugars: 1.0,
      protein: 5.0,
      totalFat: 20.5,
      satFat: 9.8,
      transFat: 0.0,
      cholesterolMg: 0.0,
      sodiumMg: 360,
      fibre: 1.8,
      calciumMg: 25,
      potassiumMg: 145,
      ironMg: 2.9,
      fruitVegPct: 0
    },
    rating: {
      grade: "E",
      score: 14,
      color: "Deep Red",
      reasons: [
        "Extremely high sugar (38.0g/100g)",
        "Fractionated palm oil shortening",
        "Grade E lowest nutritional tier"
      ],
      additivesFlagged: ["INS 500(ii)", "INS 503(ii)", "INS 322"]
    },
    fssaiLicense: "10014022002711"
  },

  // ── Britannia Bourbon ────────────────────────────────────────────────────
  {
    barcode: "8901063014115",
    productId: "britannia-bourbon-150g",
    name: "Britannia Bourbon The Original Chocolate Biscuits",
    brand: "Britannia",
    category: "BISCUIT",
    subCategory: "CHOCOLATE CREME BISCUIT",
    priceINR: 30,
    servingSizeG: 150,
    palmOil: true,
    palmOilStatus: "confirmed",
    ingredientsText: "Refined Wheat Flour (Maida), Sugar (38.3%), Refined Palm Oil, Edible Maize Starch, Cocoa Solids (2.3%), Invert Sugar Syrup, Raising Agents [503(ii), 500(ii)], Milk Solids, Iodised Salt, Emulsifiers [322, 471].",
    ingredients: [
      "Refined Wheat Flour (Maida)",
      "Sugar (38.3%)",
      "Refined Palm Oil",
      "Edible Maize Starch",
      "Cocoa Solids (2.3%)",
      "Invert Sugar Syrup",
      "Raising Agents [503(ii), 500(ii)]",
      "Milk Solids",
      "Iodised Salt",
      "Emulsifiers [322, 471]"
    ],
    nutrition: {
      caloriesKcal: 493.5,
      energyKj: 2065,
      carbs: 72.7,
      sugars: 38.3,
      addedSugars: 37.0,
      naturalSugars: 1.3,
      protein: 5.0,
      totalFat: 20.3,
      satFat: 10.1,
      transFat: 0.0,
      cholesterolMg: 0.0,
      sodiumMg: 119,
      fibre: 1.5,
      calciumMg: 22,
      potassiumMg: 135,
      ironMg: 2.4,
      fruitVegPct: 0
    },
    rating: {
      grade: "E",
      score: 15,
      color: "Deep Red",
      reasons: [
        "Extremely high sugar (38.3g per 100g)",
        "Refined Palm Oil fat (10.1g saturated fat)",
        "Grade E lowest nutritional tier"
      ],
      additivesFlagged: ["INS 503(ii)", "INS 500(ii)", "INS 322", "INS 471"]
    },
    fssaiLicense: "10015043001129"
  }
];

async function updateMongo() {
  const client = new MongoClient(uri);
  try {
    await client.connect();
    const db = client.db("food_database");
    const productsCol = db.collection("products");
    const foodDbCol = db.collection("food_database");

    console.log(`Starting MongoDB update for ${MONGO_UPDATES.length} target products...`);

    for (const p of MONGO_UPDATES) {
      // Find by barcode first
      let existing = await productsCol.findOne({ barcode: p.barcode });
      if (!existing && p.productId) {
        existing = await productsCol.findOne({ productId: p.productId });
      }

      const updateFields = {
        barcode: p.barcode,
        name: p.name,
        brand: p.brand,
        category: p.category,
        subCategory: p.subCategory,
        priceINR: p.priceINR,
        servingSizeG: p.servingSizeG,
        palmOil: p.palmOil,
        palmOilStatus: p.palmOilStatus,
        ingredientsText: p.ingredientsText,
        ingredients: p.ingredients,
        nutrition: p.nutrition,
        rating: p.rating,
        fssaiLicense: p.fssaiLicense,
        updatedAt: new Date().toISOString()
      };

      if (existing) {
        // Update existing doc
        await productsCol.updateOne({ _id: existing._id }, { $set: updateFields });
      } else {
        // Insert new doc
        await productsCol.insertOne({
          productId: p.productId,
          ...updateFields,
          createdAt: new Date().toISOString()
        });
      }

      // Sync food_database collection too
      let existingFoodDb = await foodDbCol.findOne({ barcode: p.barcode });
      if (!existingFoodDb && p.productId) {
        existingFoodDb = await foodDbCol.findOne({ productId: p.productId });
      }

      if (existingFoodDb) {
        await foodDbCol.updateOne({ _id: existingFoodDb._id }, { $set: updateFields });
      } else {
        await foodDbCol.insertOne({
          productId: p.productId,
          ...updateFields,
          createdAt: new Date().toISOString()
        });
      }

      console.log(`✓ Updated MongoDB: [${p.barcode}] ${p.name} (Grade: ${p.rating.grade}, Score: ${p.rating.score})`);
    }

    console.log("\nAll target products successfully updated in MongoDB Atlas!");
  } catch (err) {
    console.error("Error updating MongoDB:", err);
  } finally {
    await client.close();
  }
}

updateMongo();

const mongoose = require("mongoose");
require("dotenv").config();

const uri = process.env.MONGODB_URI || "mongodb://food_admin:hackcbs9@ac-b3c3wun-shard-00-00.lhnu949.mongodb.net:27017,ac-b3c3wun-shard-00-01.lhnu949.mongodb.net:27017,ac-b3c3wun-shard-00-02.lhnu949.mongodb.net:27017/food_database?ssl=true&replicaSet=atlas-4pudd2-shard-0&authSource=admin";

const products = [
  // BISCUITS
  {
    productId: "parle-g-gluco-80g",
    barcode: "8901719101068",
    name: "Parle-G Original Gluco Biscuits",
    brand: "Parle",
    category: "BISCUIT",
    subCategory: "GLUCOSE",
    ingredientsText: "Refined Wheat Flour (Maida), Sugar, Refined Palm Oil, Invert Sugar Syrup, Raising Agents [503 (ii), 500 (ii)], Milk Solids, Iodised Salt, Emulsifiers [322, 472e], Flavour (Artificial Flavouring Substances - Vanilla).",
    priceINR: 10,
    servingSizeG: 80,
    nutrition: { caloriesKcal: 454, energyKj: 1899, carbs: 78.2, sugars: 25.5, protein: 6.5, totalFat: 13.0, satFat: 6.0, transFat: 0, sodiumMg: 260, fibre: 1.5, fruitVegPct: 0 },
    palmOil: true,
    palmOilStatus: "confirmed",
    fssaiLicense: "10013022002253"
  },
  {
    productId: "britannia-good-day-butter-100g",
    barcode: "8901063012013",
    name: "Britannia Good Day Butter Cookies",
    brand: "Britannia",
    category: "BISCUIT",
    subCategory: "BUTTER COOKIES",
    ingredientsText: "Refined Wheat Flour (Maida), Sugar, Edible Vegetable Oil (Palm), Butter (2%), Invert Sugar Syrup, Milk Solids, Raising Agents [503(ii), 500(ii)], Iodised Salt, Emulsifiers [322, 471, 472e].",
    priceINR: 20,
    servingSizeG: 100,
    nutrition: { caloriesKcal: 490, energyKj: 2050, carbs: 68.0, sugars: 23.0, protein: 6.0, totalFat: 21.5, satFat: 10.5, transFat: 0, sodiumMg: 220, fibre: 1.0, fruitVegPct: 0 },
    palmOil: true,
    palmOilStatus: "confirmed",
    fssaiLicense: "10015043001129"
  },
  {
    productId: "britannia-good-day-cashew-100g",
    barcode: "8901058852341",
    name: "Britannia Good Day Cashew Cookies",
    brand: "Britannia",
    category: "BISCUIT",
    subCategory: "NUT COOKIES",
    ingredientsText: "Refined Wheat Flour (Maida), Sugar, Edible Vegetable Oil (Palm), Cashew Bits (4.5%), Butter, Invert Sugar Syrup, Milk Solids, Raising Agents [503(ii), 500(ii)], Iodised Salt, Emulsifiers [322, 471].",
    priceINR: 25,
    servingSizeG: 100,
    nutrition: { caloriesKcal: 501, energyKj: 2096, carbs: 67.0, sugars: 22.0, protein: 7.0, totalFat: 23.0, satFat: 10.0, transFat: 0, sodiumMg: 210, fibre: 1.2, fruitVegPct: 0 },
    palmOil: true,
    palmOilStatus: "confirmed",
    fssaiLicense: "10015043001129"
  },
  {
    productId: "britannia-marie-gold-120g",
    barcode: "8901063011030",
    name: "Britannia Marie Gold Biscuits",
    brand: "Britannia",
    category: "BISCUIT",
    subCategory: "MARIE",
    ingredientsText: "Refined Wheat Flour (Maida), Sugar, Refined Palm Oil, Invert Sugar Syrup, Milk Solids, Raising Agents [503(ii), 500(ii)], Iodised Salt, Dough Conditioner (223), Emulsifier (472e).",
    priceINR: 15,
    servingSizeG: 120,
    nutrition: { caloriesKcal: 446, energyKj: 1866, carbs: 78.0, sugars: 21.5, protein: 8.0, totalFat: 11.5, satFat: 5.0, transFat: 0, sodiumMg: 280, fibre: 2.0, fruitVegPct: 0 },
    palmOil: true,
    palmOilStatus: "confirmed",
    fssaiLicense: "10015043001129"
  },
  {
    productId: "sunfeast-dark-fantasy-choco-fills-75g",
    barcode: "8901725132209",
    name: "Sunfeast Dark Fantasy Choco Fills",
    brand: "Sunfeast (ITC)",
    category: "BISCUIT",
    subCategory: "CHOCO FILLS",
    ingredientsText: "Choco Creme (38%) [Sugar, Refined Palm Oil, Cocoa Solids (5.5%), Emulsifier (Soy Lecithin - INS 322)], Refined Wheat Flour (Maida), Hydrogenated Vegetable Oil, Sugar, Invert Syrup, Raising Agents [INS 503(ii), INS 500(ii)], Iodised Salt.",
    priceINR: 35,
    servingSizeG: 75,
    nutrition: { caloriesKcal: 512, energyKj: 2142, carbs: 65.0, sugars: 37.0, protein: 5.5, totalFat: 26.0, satFat: 12.5, transFat: 0, sodiumMg: 180, fibre: 1.5, fruitVegPct: 0 },
    palmOil: true,
    palmOilStatus: "confirmed",
    fssaiLicense: "10012031000312"
  },
  {
    productId: "cadbury-oreo-vanilla-120g",
    barcode: "7622201740924",
    name: "Oreo Original Vanilla Creme Cookies",
    brand: "Cadbury Oreo",
    category: "BISCUIT",
    subCategory: "CREAM COOKIES",
    ingredientsText: "Refined Wheat Flour (Maida), Sugar, Fractionated Palm Oil, Cocoa Solids (4.5%), Invert Sugar, Leavening Agents [500(ii), 503(ii)], Iodised Salt, Emulsifier (Soy Lecithin).",
    priceINR: 30,
    servingSizeG: 120,
    nutrition: { caloriesKcal: 483, energyKj: 2020, carbs: 70.5, sugars: 38.0, protein: 5.0, totalFat: 20.5, satFat: 9.8, transFat: 0, sodiumMg: 360, fibre: 1.8, fruitVegPct: 0 },
    palmOil: true,
    palmOilStatus: "confirmed",
    fssaiLicense: "10014022002711"
  },
  {
    productId: "parle-monaco-salted-100g",
    barcode: "8901719104038",
    name: "Parle Monaco Classic Salted Crackers",
    brand: "Parle",
    category: "BISCUIT",
    subCategory: "SALTED CRACKER",
    ingredientsText: "Refined Wheat Flour (Maida), Refined Palm Oil, Sugar, Raising Agents [503(ii), 500(ii)], Invert Sugar Syrup, Iodised Salt (1.8%), Yeast, Acidity Regulators [270, 330], Emulsifiers [471, 472e], Dough Conditioner [223].",
    priceINR: 15,
    servingSizeG: 100,
    nutrition: { caloriesKcal: 486, energyKj: 2033, carbs: 67.5, sugars: 8.5, protein: 8.0, totalFat: 20.5, satFat: 9.5, transFat: 0, sodiumMg: 780, fibre: 1.2, fruitVegPct: 0 },
    palmOil: true,
    palmOilStatus: "confirmed",
    fssaiLicense: "10013022002253"
  },
  {
    productId: "parle-krackjack-100g",
    barcode: "8901719103048",
    name: "Parle Krackjack Sweet & Salty Crackers",
    brand: "Parle",
    category: "BISCUIT",
    subCategory: "SWEET & SALTY",
    ingredientsText: "Refined Wheat Flour (Maida), Refined Palm Oil, Sugar (18%), Raising Agents [503(ii), 500(ii)], Invert Sugar Syrup, Iodised Salt (1.2%), Yeast, Emulsifier [472e], Dough Conditioner [223].",
    priceINR: 15,
    servingSizeG: 100,
    nutrition: { caloriesKcal: 488, energyKj: 2041, carbs: 69.0, sugars: 18.0, protein: 7.5, totalFat: 20.2, satFat: 9.4, transFat: 0, sodiumMg: 520, fibre: 1.5, fruitVegPct: 0 },
    palmOil: true,
    palmOilStatus: "confirmed",
    fssaiLicense: "10013022002253"
  },
  {
    productId: "parle-hide-and-seek-120g",
    barcode: "8901719114251",
    name: "Parle Hide & Seek Chocolate Chip Cookies",
    brand: "Parle",
    category: "BISCUIT",
    subCategory: "CHOCOLATE COOKIES",
    ingredientsText: "Refined Wheat Flour (Maida), Chocolate Chips (23%) [Sugar, Cocoa Mass, Cocoa Butter, Dextrose, Emulsifier (322)], Sugar, Refined Palm Oil, Invert Sugar Syrup, Raising Agents [503(ii), 500(ii)], Iodised Salt, Emulsifiers [472e].",
    priceINR: 30,
    servingSizeG: 120,
    nutrition: { caloriesKcal: 479, energyKj: 2004, carbs: 73.4, sugars: 32.5, protein: 5.9, totalFat: 18.0, satFat: 9.4, transFat: 0, sodiumMg: 114, fibre: 1.6, fruitVegPct: 0 },
    palmOil: true,
    palmOilStatus: "confirmed",
    fssaiLicense: "10013022002253"
  },

  // CHIPS & KURKURE
  {
    productId: "kurkure-masala-munch-85g",
    barcode: "8901491101837",
    name: "Kurkure Masala Munch Crisps",
    brand: "Kurkure (PepsiCo)",
    category: "SNACKS",
    subCategory: "CORN PUFFS",
    ingredientsText: "Rice Meal (43.5%), Edible Vegetable Oil (Palmolein), Corn Meal (20.0%), Gram Meal (3.0%), Spices and Condiments (Onion Powder, Chilli Powder, Amchur, Coriander Powder, Ginger Powder, Garlic Powder, Black Pepper, Turmeric, Fenugreek), Iodised Salt, Sugar, Citric Acid (INS 330).",
    priceINR: 20,
    servingSizeG: 85,
    nutrition: { caloriesKcal: 561, energyKj: 2347, carbs: 55.4, sugars: 1.5, protein: 6.2, totalFat: 35.0, satFat: 15.8, transFat: 0, sodiumMg: 840, fibre: 2.2, fruitVegPct: 0 },
    palmOil: true,
    palmOilStatus: "confirmed",
    fssaiLicense: "10014064000435"
  },
  {
    productId: "kurkure-chilli-chatka-78g",
    barcode: "8901491102834",
    name: "Kurkure Chilli Chatka Crisps",
    brand: "Kurkure (PepsiCo)",
    category: "SNACKS",
    subCategory: "CORN PUFFS",
    ingredientsText: "Rice Meal, Edible Vegetable Oil (Palmolein), Corn Meal, Gram Meal, Spices & Condiments (Chilli Powder, Fennel, Ajwain, Black Pepper), Iodised Salt, Citric Acid (330), Tartaric Acid (334).",
    priceINR: 20,
    servingSizeG: 78,
    nutrition: { caloriesKcal: 558, energyKj: 2334, carbs: 56.0, sugars: 2.0, protein: 6.0, totalFat: 34.5, satFat: 15.5, transFat: 0, sodiumMg: 890, fibre: 2.0, fruitVegPct: 0 },
    palmOil: true,
    palmOilStatus: "confirmed",
    fssaiLicense: "10014064000435"
  },
  {
    productId: "lays-magic-masala-50g",
    barcode: "8901491001014",
    name: "Lay's India's Magic Masala Potato Chips",
    brand: "Lay's (PepsiCo)",
    category: "SNACKS",
    subCategory: "POTATO CHIPS",
    ingredientsText: "Potato (52%), Edible Vegetable Oil (Palmolein), Seasoning (Spices & Condiments, Iodised Salt, Sugar, Maltodextrin, Mango Powder, Citric Acid - INS 330, Flavour Enhancers - INS 627 & INS 631, Anticaking Agent - INS 551).",
    priceINR: 20,
    servingSizeG: 50,
    nutrition: { caloriesKcal: 544, energyKj: 2276, carbs: 52.8, sugars: 2.5, protein: 6.9, totalFat: 34.0, satFat: 14.2, transFat: 0, sodiumMg: 820, fibre: 3.5, fruitVegPct: 0 },
    palmOil: true,
    palmOilStatus: "confirmed",
    fssaiLicense: "10014064000435"
  },
  {
    productId: "lays-classic-salted-50g",
    barcode: "8901491000857",
    name: "Lay's Classic Salted Potato Chips",
    brand: "Lay's (PepsiCo)",
    category: "SNACKS",
    subCategory: "POTATO CHIPS",
    ingredientsText: "Potato (58%), Edible Vegetable Oil (Palmolein), Iodised Salt (1.5%).",
    priceINR: 20,
    servingSizeG: 50,
    nutrition: { caloriesKcal: 540, energyKj: 2259, carbs: 53.0, sugars: 0.5, protein: 7.0, totalFat: 33.5, satFat: 14.0, transFat: 0, sodiumMg: 580, fibre: 3.8, fruitVegPct: 0 },
    palmOil: true,
    palmOilStatus: "confirmed",
    fssaiLicense: "10014064000435"
  },
  {
    productId: "lays-cream-and-onion-50g",
    barcode: "8901491001038",
    name: "Lay's American Style Cream & Onion Potato Chips",
    brand: "Lay's (PepsiCo)",
    category: "SNACKS",
    subCategory: "POTATO CHIPS",
    ingredientsText: "Potato (52%), Edible Vegetable Oil (Palmolein), Seasoning (Sugar, Salt, Milk Solids - Cheese Powder, Skim Milk Powder, Onion Powder, Parsley, Spices, Citric Acid - INS 330, Flavour Enhancers - INS 627, INS 631).",
    priceINR: 20,
    servingSizeG: 50,
    nutrition: { caloriesKcal: 542, energyKj: 2267, carbs: 53.2, sugars: 4.8, protein: 6.8, totalFat: 33.8, satFat: 14.5, transFat: 0, sodiumMg: 720, fibre: 3.2, fruitVegPct: 0 },
    palmOil: true,
    palmOilStatus: "confirmed",
    fssaiLicense: "10014064000435"
  },
  {
    productId: "lays-spanish-tomato-tango-50g",
    barcode: "8901491001021",
    name: "Lay's Spanish Tomato Tango Potato Chips",
    brand: "Lay's (PepsiCo)",
    category: "SNACKS",
    subCategory: "POTATO CHIPS",
    ingredientsText: "Potato (52%), Edible Vegetable Oil (Palmolein), Sugar, Tomato Powder (1.2%), Iodised Salt, Spices & Condiments, Acidity Regulator (INS 330, INS 296), Anticaking Agent (INS 551).",
    priceINR: 20,
    servingSizeG: 50,
    nutrition: { caloriesKcal: 538, energyKj: 2251, carbs: 54.5, sugars: 6.5, protein: 6.5, totalFat: 33.0, satFat: 13.8, transFat: 0, sodiumMg: 690, fibre: 3.0, fruitVegPct: 1.2 },
    palmOil: true,
    palmOilStatus: "confirmed",
    fssaiLicense: "10014064000435"
  },
  {
    productId: "bingo-mad-angles-achaari-66g",
    barcode: "8901725114137",
    name: "Bingo! Mad Angles Achaari Masti",
    brand: "Bingo! (ITC)",
    category: "SNACKS",
    subCategory: "CORN TRIANGLES",
    ingredientsText: "Rice Grits (41.4%), Seasoning [Spices and Condiments, Iodised Salt, Acidity Regulators (INS 330, INS 296, INS 334), Anticaking Agent (INS 551), Flavour Enhancers (INS 627, INS 631)], Refined Palmolein, Corn Grits (20.7%), Gram Grits (6.2%).",
    priceINR: 20,
    servingSizeG: 66,
    nutrition: { caloriesKcal: 541, energyKj: 2263, carbs: 57.6, sugars: 1.8, protein: 6.9, totalFat: 31.8, satFat: 14.5, transFat: 0, sodiumMg: 790, fibre: 2.5, fruitVegPct: 0 },
    palmOil: true,
    palmOilStatus: "confirmed",
    fssaiLicense: "10012031000312"
  },
  {
    productId: "haldirams-nagpur-bhujia-150g",
    barcode: "8904004400267",
    name: "Haldiram's Nagpur Bhujia Sev",
    brand: "Haldiram's",
    category: "SNACKS",
    subCategory: "NAMKEEN",
    ingredientsText: "Moth Flour (44%), Gram Flour (11%), Edible Vegetable Oil (Palmolein / Cottonseed Oil), Iodised Salt, Red Chilli Powder, Black Pepper, Clove Powder, Cardamom Powder, Ginger Powder.",
    priceINR: 50,
    servingSizeG: 150,
    nutrition: { caloriesKcal: 588, energyKj: 2460, carbs: 42.0, sugars: 0.5, protein: 14.5, totalFat: 41.0, satFat: 15.0, transFat: 0, sodiumMg: 780, fibre: 4.5, fruitVegPct: 0 },
    palmOil: true,
    palmOilStatus: "confirmed",
    fssaiLicense: "10012022000339"
  },
  {
    productId: "haldirams-aloo-bhujia-150g",
    barcode: "8904004400304",
    name: "Haldiram's Aloo Bhujia",
    brand: "Haldiram's",
    category: "SNACKS",
    subCategory: "NAMKEEN",
    ingredientsText: "Potatoes (22%), Edible Vegetable Oil (Palmolein / Cottonseed), Gram Pulse Flour (19%), Dew Bean Flour, Rice Powder, Starch, Iodised Salt, Mint Powder, Spices and Condiments, Acidity Regulator (INS 330).",
    priceINR: 50,
    servingSizeG: 150,
    nutrition: { caloriesKcal: 578, energyKj: 2418, carbs: 45.0, sugars: 1.0, protein: 9.8, totalFat: 40.0, satFat: 15.2, transFat: 0, sodiumMg: 810, fibre: 3.5, fruitVegPct: 0 },
    palmOil: true,
    palmOilStatus: "confirmed",
    fssaiLicense: "10012022000339"
  },

  // SOFT DRINKS & COLD DRINKS
  {
    productId: "pepsi-cola-soft-drink-250ml",
    barcode: "8901491100014",
    name: "Pepsi Carbonated Soft Drink",
    brand: "Pepsi (PepsiCo)",
    category: "BEVERAGE",
    subCategory: "CARBONATED DRINK",
    ingredientsText: "Carbonated Water, Sugar, Acidity Regulator (INS 338), Colour (INS 150d), Caffeine, Flavours (Natural Flavouring Substances).",
    priceINR: 20,
    servingSizeG: 250,
    nutrition: { caloriesKcal: 43, energyKj: 180, carbs: 10.7, sugars: 10.7, protein: 0, totalFat: 0, satFat: 0, transFat: 0, sodiumMg: 11, fibre: 0, fruitVegPct: 0 },
    palmOil: false,
    palmOilStatus: "confirmed_absent",
    fssaiLicense: "10014064000435"
  },
  {
    productId: "coca-cola-original-250ml",
    barcode: "8901764012216",
    name: "Coca-Cola Original Taste",
    brand: "Coca-Cola",
    category: "BEVERAGE",
    subCategory: "CARBONATED DRINK",
    ingredientsText: "Carbonated Water, Sugar, Acidity Regulator (INS 338), Colour (INS 150d), Flavours (Natural Flavouring Substances), Caffeine.",
    priceINR: 20,
    servingSizeG: 250,
    nutrition: { caloriesKcal: 44, energyKj: 184, carbs: 10.9, sugars: 10.9, protein: 0, totalFat: 0, satFat: 0, transFat: 0, sodiumMg: 9, fibre: 0, fruitVegPct: 0 },
    palmOil: false,
    palmOilStatus: "confirmed_absent",
    fssaiLicense: "10012011000620"
  },
  {
    productId: "thums-up-charged-250ml",
    barcode: "8901764022215",
    name: "Thums Up Toofani Carbonated Drink",
    brand: "Thums Up (Coca-Cola)",
    category: "BEVERAGE",
    subCategory: "CARBONATED DRINK",
    ingredientsText: "Carbonated Water, Sugar, Acidity Regulator (INS 338), Colour (INS 150d), Flavours (Natural and Nature-Identical Flavouring Substances), Caffeine.",
    priceINR: 20,
    servingSizeG: 250,
    nutrition: { caloriesKcal: 40, energyKj: 167, carbs: 10.0, sugars: 10.0, protein: 0, totalFat: 0, satFat: 0, transFat: 0, sodiumMg: 12, fibre: 0, fruitVegPct: 0 },
    palmOil: false,
    palmOilStatus: "confirmed_absent",
    fssaiLicense: "10012011000620"
  },
  {
    productId: "sprite-lime-flavoured-250ml",
    barcode: "8901764032214",
    name: "Sprite Refreshing Lemon-Lime Drink",
    brand: "Sprite (Coca-Cola)",
    category: "BEVERAGE",
    subCategory: "CARBONATED DRINK",
    ingredientsText: "Carbonated Water, Sugar, Acidity Regulators (INS 330, INS 331), Flavours (Natural Flavouring Substances), Preservative (INS 211).",
    priceINR: 20,
    servingSizeG: 250,
    nutrition: { caloriesKcal: 40, energyKj: 167, carbs: 10.0, sugars: 10.0, protein: 0, totalFat: 0, satFat: 0, transFat: 0, sodiumMg: 14, fibre: 0, fruitVegPct: 0 },
    palmOil: false,
    palmOilStatus: "confirmed_absent",
    fssaiLicense: "10012011000620"
  },
  {
    productId: "mountain-dew-250ml",
    barcode: "8901491100021",
    name: "Mountain Dew Citrus Soft Drink",
    brand: "Mountain Dew (PepsiCo)",
    category: "BEVERAGE",
    subCategory: "CARBONATED DRINK",
    ingredientsText: "Carbonated Water, Sugar, Acidity Regulator (INS 330), Flavour (Natural and Nature Identical Flavouring Substances), Preservative (INS 211), Caffeine (11.5 mg/100ml), Colour (INS 102).",
    priceINR: 20,
    servingSizeG: 250,
    nutrition: { caloriesKcal: 48, energyKj: 201, carbs: 12.0, sugars: 12.0, protein: 0, totalFat: 0, satFat: 0, transFat: 0, sodiumMg: 15, fibre: 0, fruitVegPct: 0 },
    palmOil: false,
    palmOilStatus: "confirmed_absent",
    fssaiLicense: "10014064000435"
  },
  {
    productId: "7up-lemon-soft-drink-250ml",
    barcode: "8901491100038",
    name: "7UP Clear Lemon Flavour Soft Drink",
    brand: "7UP (PepsiCo)",
    category: "BEVERAGE",
    subCategory: "CARBONATED DRINK",
    ingredientsText: "Carbonated Water, Sugar, Acidity Regulators (INS 330, INS 296), Citrus Flavours, Preservative (INS 211).",
    priceINR: 20,
    servingSizeG: 250,
    nutrition: { caloriesKcal: 40, energyKj: 167, carbs: 10.0, sugars: 10.0, protein: 0, totalFat: 0, satFat: 0, transFat: 0, sodiumMg: 13, fibre: 0, fruitVegPct: 0 },
    palmOil: false,
    palmOilStatus: "confirmed_absent",
    fssaiLicense: "10014064000435"
  },
  {
    productId: "frooti-mango-drink-160ml",
    barcode: "8901719106018",
    name: "Frooti Fresh 'N' Juicy Mango Drink",
    brand: "Frooti (Parle Agro)",
    category: "BEVERAGE",
    subCategory: "MANGO DRINK",
    ingredientsText: "Water, Mango Pulp (19.5%), Sugar, Acidity Regulator (INS 330), Antioxidant (INS 300), Preservative (INS 211), Colour (INS 160a).",
    priceINR: 10,
    servingSizeG: 160,
    nutrition: { caloriesKcal: 65, energyKj: 272, carbs: 16.2, sugars: 15.0, protein: 0.1, totalFat: 0, satFat: 0, transFat: 0, sodiumMg: 8, fibre: 0.2, fruitVegPct: 19.5 },
    palmOil: false,
    palmOilStatus: "confirmed_absent",
    fssaiLicense: "10012022000227"
  },
  {
    productId: "maaza-mango-drink-250ml",
    barcode: "8901764041216",
    name: "Maaza Mango Pulp Drink",
    brand: "Maaza (Coca-Cola)",
    category: "BEVERAGE",
    subCategory: "MANGO DRINK",
    ingredientsText: "Water, Mango Pulp (19.5%), Sugar, Acidity Regulator (INS 330), Antioxidant (INS 300), Preservative (INS 202).",
    priceINR: 20,
    servingSizeG: 250,
    nutrition: { caloriesKcal: 62, energyKj: 260, carbs: 15.5, sugars: 14.5, protein: 0.1, totalFat: 0, satFat: 0, transFat: 0, sodiumMg: 9, fibre: 0.2, fruitVegPct: 19.5 },
    palmOil: false,
    palmOilStatus: "confirmed_absent",
    fssaiLicense: "10012011000620"
  },

  // PACKAGED WATER BOTTLES
  {
    productId: "bisleri-mineral-water-1l",
    barcode: "8906017290019",
    name: "Bisleri Mineral Water with Added Minerals (1L)",
    brand: "Bisleri",
    category: "BEVERAGE",
    subCategory: "PACKAGED WATER",
    ingredientsText: "Treated Water, Minerals (Magnesium Sulphate, Potassium Bicarbonate). Ozonated & Reverse Osmosis Purified.",
    priceINR: 20,
    servingSizeG: 1000,
    nutrition: { caloriesKcal: 0, energyKj: 0, carbs: 0, sugars: 0, protein: 0, totalFat: 0, satFat: 0, transFat: 0, sodiumMg: 0.2, fibre: 0, fruitVegPct: 0 },
    palmOil: false,
    palmOilStatus: "confirmed_absent",
    fssaiLicense: "10013022001539"
  },
  {
    productId: "bisleri-mineral-water-500ml",
    barcode: "8906017290026",
    name: "Bisleri Mineral Water with Added Minerals (500ml)",
    brand: "Bisleri",
    category: "BEVERAGE",
    subCategory: "PACKAGED WATER",
    ingredientsText: "Treated Water, Minerals (Magnesium Sulphate, Potassium Bicarbonate). Ozonated & Reverse Osmosis Purified.",
    priceINR: 10,
    servingSizeG: 500,
    nutrition: { caloriesKcal: 0, energyKj: 0, carbs: 0, sugars: 0, protein: 0, totalFat: 0, satFat: 0, transFat: 0, sodiumMg: 0.2, fibre: 0, fruitVegPct: 0 },
    palmOil: false,
    palmOilStatus: "confirmed_absent",
    fssaiLicense: "10013022001539"
  },
  {
    productId: "kinley-drinking-water-1l",
    barcode: "8901764051017",
    name: "Kinley Packaged Drinking Water with Added Minerals (1L)",
    brand: "Kinley (Coca-Cola)",
    category: "BEVERAGE",
    subCategory: "PACKAGED WATER",
    ingredientsText: "Purified Water, Salts of Sodium and Magnesium (Sodium Chloride, Magnesium Sulphate). Reverse Osmosis Processed.",
    priceINR: 20,
    servingSizeG: 1000,
    nutrition: { caloriesKcal: 0, energyKj: 0, carbs: 0, sugars: 0, protein: 0, totalFat: 0, satFat: 0, transFat: 0, sodiumMg: 0.3, fibre: 0, fruitVegPct: 0 },
    palmOil: false,
    palmOilStatus: "confirmed_absent",
    fssaiLicense: "10012011000620"
  },
  {
    productId: "aquafina-drinking-water-1l",
    barcode: "8901491100052",
    name: "Aquafina Pure Packaged Drinking Water (1L)",
    brand: "Aquafina (PepsiCo)",
    category: "BEVERAGE",
    subCategory: "PACKAGED WATER",
    ingredientsText: "Purified Water. 7-Step Hydro-7 Purification Process with Reverse Osmosis.",
    priceINR: 20,
    servingSizeG: 1000,
    nutrition: { caloriesKcal: 0, energyKj: 0, carbs: 0, sugars: 0, protein: 0, totalFat: 0, satFat: 0, transFat: 0, sodiumMg: 0.1, fibre: 0, fruitVegPct: 0 },
    palmOil: false,
    palmOilStatus: "confirmed_absent",
    fssaiLicense: "10014064000435"
  },

  // NOODLES
  {
    productId: "maggi-2-minute-noodles-70g",
    barcode: "8901058859180",
    name: "Maggi 2-Minute Masala Instant Noodles",
    brand: "Maggi (Nestlé)",
    category: "NOODLES",
    subCategory: "INSTANT NOODLES",
    ingredientsText: "Noodles: Refined Wheat Flour (Maida), Palm Oil, Iodised Salt, Wheat Gluten, Thickeners (508, 412), Acidity Regulators (501(i), 500(i)). Tastemaker: Hydrolysed Groundnut Protein, Mixed Spices (23.6%) [Onion Powder, Coriander, Chilli, Turmeric, Garlic, Cumin, Aniseed, Ginger, Fenugreek, Black Pepper, Clove, Nutmeg, Cardamom], Sugar, Edible Starch, Palm Oil, Thickener (508), Caramel Colour (150d), Iodised Salt, Flavour Enhancer (635), Acidity Regulator (330).",
    priceINR: 14,
    servingSizeG: 70,
    nutrition: { caloriesKcal: 427, energyKj: 1787, carbs: 63.5, sugars: 2.2, protein: 8.0, totalFat: 15.7, satFat: 6.8, transFat: 0, sodiumMg: 1040, fibre: 3.5, fruitVegPct: 0 },
    palmOil: true,
    palmOilStatus: "confirmed",
    fssaiLicense: "10012011000168"
  },
  {
    productId: "yippee-magic-masala-70g",
    barcode: "8901725131011",
    name: "Sunfeast YiPPee! Magic Masala Instant Noodles",
    brand: "YiPPee! (ITC)",
    category: "NOODLES",
    subCategory: "INSTANT NOODLES",
    ingredientsText: "Wheat Flour (Maida), Refined Palm Oil, Iodised Salt, Mineral (Calcium Carbonate), Guar Gum (INS 412), Acidity Regulators [INS 501(i), INS 500(i)]. Seasoning: Spices and Condiments (Garlic, Onion, Cumin, Ginger, Red Chilli), Hydrolysed Soya Protein, Sugar, Yeast Extract, Flavour Enhancer (INS 627, INS 631).",
    priceINR: 14,
    servingSizeG: 70,
    nutrition: { caloriesKcal: 468, energyKj: 1958, carbs: 64.0, sugars: 3.5, protein: 9.0, totalFat: 19.5, satFat: 9.0, transFat: 0, sodiumMg: 980, fibre: 3.2, fruitVegPct: 0 },
    palmOil: true,
    palmOilStatus: "confirmed",
    fssaiLicense: "10012031000312"
  },

  // CHOCOLATES
  {
    productId: "cadbury-dairy-milk-chocolate-50g",
    barcode: "8901233024888",
    name: "Cadbury Dairy Milk Chocolate",
    brand: "Cadbury (Mondelez)",
    category: "CHOCOLATE",
    subCategory: "MILK CHOCOLATE",
    ingredientsText: "Sugar, Milk Solids (22%), Cocoa Butter, Cocoa Solids, Emulsifiers (442, 476), Flavours (Natural, Nature Identical and Artificial Flavouring Substances - Vanilla).",
    priceINR: 45,
    servingSizeG: 50,
    nutrition: { caloriesKcal: 532, energyKj: 2226, carbs: 60.5, sugars: 57.4, protein: 7.8, totalFat: 29.5, satFat: 18.2, transFat: 0.1, sodiumMg: 135, fibre: 2.0, fruitVegPct: 0 },
    palmOil: false,
    palmOilStatus: "confirmed_absent",
    fssaiLicense: "10014022002711"
  },
  {
    productId: "nestle-kitkat-4-finger-38g",
    barcode: "8901058852334",
    name: "Nestlé KitKat 4-Finger Crisp Wafer Chocolate",
    brand: "KitKat (Nestlé)",
    category: "CHOCOLATE",
    subCategory: "WAFER CHOCOLATE",
    ingredientsText: "Milk Chocolate (69%) [Sugar, Milk Solids (16%), Cocoa Butter, Cocoa Solids (4.5%), Emulsifier (Soya Lecithin)], Wafer [Refined Wheat Flour (Maida), Sugar, Hydrogenated Palm Oil, Cocoa Solids, Raising Agent (500(ii)), Yeast].",
    priceINR: 25,
    servingSizeG: 38,
    nutrition: { caloriesKcal: 504, energyKj: 2109, carbs: 64.2, sugars: 47.0, protein: 6.8, totalFat: 24.5, satFat: 14.2, transFat: 0, sodiumMg: 100, fibre: 1.8, fruitVegPct: 0 },
    palmOil: true,
    palmOilStatus: "confirmed",
    fssaiLicense: "10012011000168"
  },

  // WOMEN HYGIENE PADS
  {
    productId: "whisper-choice-ultra-wings-6pads",
    barcode: "4902430752139",
    name: "Whisper Choice Ultra Wings Sanitary Pads",
    brand: "Whisper (P&G)",
    category: "period",
    subCategory: "SANITARY PADS",
    productCategory: "menstrual_pad",
    ingredientsText: "Cellulose Fluff Pulp, Polyethylene Backsheet, Polypropylene Non-Woven Topsheet, Absorbent Polymer Gel, Adhesive, Synthetic Fragrance.",
    priceINR: 45,
    servingSizeG: 6,
    nutrition: null,
    palmOil: false,
    fssaiLicense: "BIS: IS 5405"
  },
  {
    productId: "stayfree-secure-cottony-7pads",
    barcode: "8901012117015",
    name: "Stayfree Secure Cottony Soft Wings Sanitary Pads",
    brand: "Stayfree (J&J)",
    category: "period",
    subCategory: "SANITARY PADS",
    productCategory: "menstrual_pad",
    ingredientsText: "Absorbent Wood Pulp, Polyethylene Outer Layer, Odour Control System, Gel Crystals, Hypoallergenic Non-Woven Cottony Cover.",
    priceINR: 40,
    servingSizeG: 7,
    nutrition: null,
    palmOil: false,
    fssaiLicense: "BIS: IS 5405"
  },
  {
    productId: "sofy-antibacteria-extra-long-7pads",
    barcode: "8903622001018",
    name: "Sofy AntiBacteria Extra Long Sanitary Pads",
    brand: "Sofy (Unicharm)",
    category: "period",
    subCategory: "SANITARY PADS",
    productCategory: "menstrual_pad",
    ingredientsText: "Non-Woven Polyolefin Topsheet with Natural Tree Extract Antibacterial Sheet, Pulp, Super Absorbent Polymer, Polyethylene Film.",
    priceINR: 50,
    servingSizeG: 7,
    nutrition: null,
    palmOil: false,
    fssaiLicense: "BIS: IS 5405"
  },
  {
    productId: "nua-ultra-safe-organic-cotton-pads",
    barcode: "8908011244018",
    name: "Nua Ultra Safe Rash-Free Organic Cotton Pads",
    brand: "Nua",
    category: "period",
    subCategory: "ORGANIC SANITARY PADS",
    productCategory: "menstrual_pad",
    ingredientsText: "100% GOTS Certified Organic Cotton Topsheet, Elemental Chlorine-Free Fluff Pulp, Non-Toxic Leak-Proof Biodegradable Backing.",
    priceINR: 199,
    servingSizeG: 12,
    nutrition: null,
    palmOil: false,
    fssaiLicense: "BIS: IS 5405"
  }
];

async function seed() {
  try {
    await mongoose.connect(uri);
    const db = mongoose.connection.db;
    console.log(`Starting seeding of ${products.length} verified products into MongoDB Atlas...`);

    let seededCount = 0;
    for (const p of products) {
      p.updatedAt = new Date();
      p.createdAt = p.createdAt || new Date();

      for (const colName of ["products", "food_database"]) {
        await db.collection(colName).updateOne(
          { barcode: p.barcode },
          { $set: p },
          { upsert: true }
        );
      }
      // Clear scan_cache for this barcode so official product data takes immediate priority
      await db.collection("scan_cache").deleteOne({ barcode: p.barcode });
      seededCount++;
    }

    const countP = await db.collection("products").countDocuments();
    const countF = await db.collection("food_database").countDocuments();
    console.log(`Seeded ${seededCount} products successfully!`);
    console.log(`Collection "products" total count: ${countP}`);
    console.log(`Collection "food_database" total count: ${countF}`);
    await mongoose.disconnect();
    process.exit(0);
  } catch (err) {
    console.error("Seeding error:", err);
    process.exit(1);
  }
}

seed();

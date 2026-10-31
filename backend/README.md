# Product Health Intelligence API

NestJS + TypeScript backend for the Product Health Intelligence Platform.

## Features

- **Barcode Scanning & Lookups**: Look up products by standard barcode format (8, 12 padded to 13, 13, 14 digits).
- **In-Code Pure Rating Engine**: Computes Nutri-Score-based A–E grades, negative/positive point breakdowns, palm oil downgrades, and additive warnings in deterministic code (never delegated to AI).
- **Multimodal AI Label Extraction**: Extracts nutrition facts and every single ingredient from label photos using Google Gen AI SDK (`@google/genai`) with structured output schemas and code validation.
- **Scan Cache**: Caches scanned and AI-extracted products into `scan_cache`. The API **writes ONLY to `scan_cache`** and **never writes to the existing product collection (`food_database`)**.

## Setup

```bash
cp .env.example .env
npm install
```

Configure these variables in `.env`:

- `MONGODB_URI`: MongoDB connection string
- `MONGODB_COLLECTION`: Existing product collection name (`products`)
- `SCAN_CACHE_COLLECTION`: Cache collection name (`scan_cache`, defaults to `scan_cache`)
- `GEMINI_API_KEY`: Google AI Studio API key
- `GEMINI_MODEL`: Model name (e.g. `gemini-2.5-flash`)

## Endpoints

| Method | Path | Description |
| --- | --- | --- |
| GET | `/api/v1/health` | API status and MongoDB connectivity health check |
| GET | `/api/v1/products?page=1&limit=20` | Paginated products from the existing collection |
| GET | `/api/v1/products/:productId` | Lookup by product ID |
| GET | `/api/v1/scan/:barcode` | Barcode scan: checks database collection, then scan cache; returns `needsLabelPhoto: true` if unknown |
| POST | `/api/v1/scan/label` | Barcode + label photo upload: runs full decision tree with Gemini OCR extraction, ratings, and cache |

## The Scan Decision Tree

Every scan request follows an explicit decision tree:

1. **Database Match**: Check existing product collection. If found, calculate grade and return source `'database'` (never calls Gemini).
2. **Cache Match**: Check `scan_cache` collection. If found, re-calculate grade with current code and return source `'cache'` (never calls Gemini).
3. **No Image Provided**: If no product exists and no image was sent, return `{ status: 'NOT_FOUND', needsLabelPhoto: true }`.
4. **Gemini Not Configured**: If a photo was sent but `GEMINI_API_KEY` is missing, return HTTP 503.
5. **Gemini Extraction & Rating**: Extract nutrition and ingredients with Gemini.
   - If confidence < 0.5 or missing both nutrition and ingredients: return `{ status: 'NEEDS_RETAKE', reason }`.
   - Otherwise, rate product, save to `scan_cache`, and return source `'gemini'`.

## Grading Method & Limits

- **General Food (Nutri-Score based)**:
  - Calculated strictly per 100 g: energy ($kJ$), sugars ($g$), saturated fat ($g$), sodium ($mg$), fibre ($g$), protein ($g$), fruit/veg (%).
  - Negative points $N = \text{energy} + \text{sugars} + \text{satFat} + \text{sodium}$.
  - If $N < 11$: $\text{score} = N - (\text{fibre} + \text{protein} + \text{fruitVeg})$.
  - If $N \ge 11$ and $\text{fruitVeg} < 5$: $\text{score} = N - (\text{fibre} + \text{fruitVeg})$ (protein is excluded).
  - Score mapping: $\le -1 \rightarrow \mathbf{A}$, $0..2 \rightarrow \mathbf{B}$, $3..10 \rightarrow \mathbf{C}$, $11..18 \rightarrow \mathbf{D}$, $\ge 19 \rightarrow \mathbf{E}$.
  - **Palm Oil Downgrade**: If palm oil is confirmed, grade is downgraded by 1 level (e.g. A to B, C to D, E remains E).
  - *Method note*: This is a simplified general-food version; beverages, fats, and cheeses use different tables in the official scheme.
- **Period Hygiene Products**:
  - Transparent rubric: fragrance/perfume (-2), chlorine bleached (-2), synthetic plastic/polyethylene layer (-1), organic cotton (+2), conventional cotton (+1), biodegradable/compostable (+1), dermatologically tested (+1).
  - Mapping: $\ge 3 \rightarrow \mathbf{A}$, $2 \rightarrow \mathbf{B}$, $1 \rightarrow \mathbf{C}$, $0 \rightarrow \mathbf{D}$, $< 0 \rightarrow \mathbf{E}$.
- **Pregnancy Warnings**:
  - Highlights ingredients of concern (alcohol, caffeine, unpasteurised ingredients, high-dose retinol, St. John's Wort, Dong Quai) as warnings without changing grades. Includes medical consultation disclaimer.

## Tests & Linting

```bash
npm run build
npm test
npm run test:e2e
npm run lint
```

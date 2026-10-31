# Product Health Intelligence API

NestJS + TypeScript backend for the Product Health Intelligence Platform.

Phase 2: MongoDB Atlas connection to the **existing** product collection, plus read-only product retrieval.

## Setup

```bash
cp .env.example .env
npm install
```

Set these in `.env` (do not commit real credentials):

- `MONGODB_URI` — Atlas connection string for the existing database
- `MONGODB_COLLECTION` — existing product collection name

The API does not create databases or collections, and it does not write to product documents.

## Development

```bash
npm run start:dev
```

## Build

```bash
npm run build
npm run start:prod
```

## Endpoints

| Method | Path | Description |
| --- | --- | --- |
| GET | `/api/v1/health` | API status plus MongoDB ping |
| GET | `/api/v1/products?page=1&limit=20` | Paginated products from the existing collection |
| GET | `/api/v1/products/:productId` | Lookup by custom `productId` (not Mongo `_id`) |

## Tests

```bash
npm test
npm run test:e2e
```

End-to-end tests run only when `MONGODB_URI` and `MONGODB_COLLECTION` are set.

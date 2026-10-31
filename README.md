# Product Health Intelligence Platform

A platform for scanning food and sanitary products, identifying ingredients, retrieving scientific evidence, evaluating regulatory requirements, and generating an explainable A–E rating.

Phase 1 covers **project initialization** only: a NestJS TypeScript API with environment-based configuration and a health-check endpoint.

## Prerequisites

- Node.js 20+
- npm 10+

## Backend setup

```bash
cd backend
cp .env.example .env
npm install
```

Edit `.env` as needed. Do not commit `.env`; it is gitignored.

## Run the API

Development (watch mode):

```bash
npm run start:dev
```

Production-style start after a build:

```bash
npm run build
npm run start:prod
```

The API listens on `PORT` from `.env` (default `3000`) with global prefix `/api/v1`.

Health check:

```bash
curl http://localhost:3000/api/v1/health
```

Expected response:

```json
{
  "status": "ok",
  "message": "Product Health Intelligence API is running"
}
```

## Scripts

| Script | Description |
| --- | --- |
| `npm run start:dev` | Start in watch mode |
| `npm run start` | Start once without watch |
| `npm run start:debug` | Start with the debugger |
| `npm run build` | Compile TypeScript |
| `npm run start:prod` | Run the compiled `dist` build |
| `npm run lint` | Lint and auto-fix |
| `npm test` | Unit tests |
| `npm run test:e2e` | End-to-end tests |
| `npm run test:cov` | Unit tests with coverage |

## Project layout

```
backend/
  src/
    main.ts              Application bootstrap
    app.module.ts        Root module
    app.setup.ts         Global prefix, CORS, ValidationPipe
    health/              Health-check endpoint
  .env.example           Placeholder configuration
```

## Current scope

Phase 1 does **not** include authentication, MongoDB schemas, OCR, barcode scanning, ingredient intelligence, regulatory rules, or rating algorithms.

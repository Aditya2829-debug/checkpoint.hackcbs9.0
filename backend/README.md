# Product Health Intelligence API

NestJS + TypeScript backend for the Product Health Intelligence Platform.

Phase 1: application bootstrap, environment configuration, and `GET /api/v1/health`.

## Setup

```bash
cp .env.example .env
npm install
```

## Development

```bash
npm run start:dev
```

## Build

```bash
npm run build
npm run start:prod
```

## Tests

```bash
npm test
npm run test:e2e
```

Health endpoint: `http://localhost:3000/api/v1/health`

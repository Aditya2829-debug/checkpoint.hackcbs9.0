# Multi-stage build for CheckPoint Backend NestJS API
FROM node:22-alpine AS builder

WORKDIR /app

# Install build dependencies
COPY package*.json ./
RUN npm ci

# Copy source code and build
COPY . .
RUN npm run build

# Production runtime stage
FROM node:22-alpine AS runner

WORKDIR /app

ENV NODE_ENV=production
ENV PORT=8000
ENV API_PREFIX=api/v1
ENV CORS_ORIGIN=*

# Install only production dependencies
COPY package*.json ./
RUN npm ci --omit=dev && npm cache clean --force

# Copy compiled files from builder
COPY --from=builder /app/dist ./dist

EXPOSE 8000

CMD ["node", "dist/main"]

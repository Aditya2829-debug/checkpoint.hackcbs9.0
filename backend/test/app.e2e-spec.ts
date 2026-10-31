import { Test, TestingModule } from '@nestjs/testing';
import { INestApplication } from '@nestjs/common';
import request from 'supertest';
import { App } from 'supertest/types';
import { AppModule } from './../src/app.module';
import { configureApp } from './../src/app.setup';

const hasMongoConfig = Boolean(
  process.env.MONGODB_URI?.trim() && process.env.MONGODB_COLLECTION?.trim(),
);

(hasMongoConfig ? describe : describe.skip)('API (e2e)', () => {
  let app: INestApplication<App>;

  beforeAll(async () => {
    const moduleFixture: TestingModule = await Test.createTestingModule({
      imports: [AppModule],
    }).compile();

    app = moduleFixture.createNestApplication();
    configureApp(app);
    await app.init();
  });

  it('GET /api/v1/health includes database connectivity', async () => {
    const response = await request(app.getHttpServer())
      .get('/api/v1/health')
      .expect(200);

    expect(response.body).toMatchObject({
      status: 'ok',
      message: 'Product Health Intelligence API is running',
      database: { connected: true, status: 'connected' },
    });
  });

  it('GET /api/v1/products returns paginated products', async () => {
    const response = await request(app.getHttpServer())
      .get('/api/v1/products')
      .query({ page: 1, limit: 5 })
      .expect(200);

    expect(response.body.page).toBe(1);
    expect(response.body.limit).toBe(5);
    expect(typeof response.body.total).toBe('number');
    expect(typeof response.body.totalPages).toBe('number');
    expect(Array.isArray(response.body.data)).toBe(true);
  });

  it('GET /api/v1/products rejects invalid pagination', async () => {
    await request(app.getHttpServer())
      .get('/api/v1/products')
      .query({ page: 0, limit: 'abc' })
      .expect(400);
  });

  it('GET /api/v1/products/:productId returns 404 for a missing product', async () => {
    await request(app.getHttpServer())
      .get('/api/v1/products/does-not-exist-product-id')
      .expect(404);
  });

  afterAll(async () => {
    await app.close();
  });
});

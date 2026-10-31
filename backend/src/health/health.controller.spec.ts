import { Test, TestingModule } from '@nestjs/testing';
import { HealthController } from './health.controller';
import { HealthService } from './health.service';

describe('HealthController', () => {
  let controller: HealthController;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [HealthController],
      providers: [
        {
          provide: HealthService,
          useValue: {
            check: jest.fn().mockResolvedValue({
              status: 'ok',
              message: 'Product Health Intelligence API is running',
              database: { connected: true, status: 'connected' },
            }),
          },
        },
      ],
    }).compile();

    controller = module.get<HealthController>(HealthController);
  });

  it('should return a running status payload with database status', async () => {
    await expect(controller.check()).resolves.toEqual({
      status: 'ok',
      message: 'Product Health Intelligence API is running',
      database: { connected: true, status: 'connected' },
    });
  });
});

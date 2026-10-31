import { Test, TestingModule } from '@nestjs/testing';
import { HealthController } from './health.controller';

describe('HealthController', () => {
  let controller: HealthController;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [HealthController],
    }).compile();

    controller = module.get<HealthController>(HealthController);
  });

  it('should return a running status payload', () => {
    expect(controller.check()).toEqual({
      status: 'ok',
      message: 'Product Health Intelligence API is running',
    });
  });
});

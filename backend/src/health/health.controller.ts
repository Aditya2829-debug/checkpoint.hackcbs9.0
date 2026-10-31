import { Controller, Get } from '@nestjs/common';

@Controller('health')
export class HealthController {
  @Get()
  check(): { status: string; message: string } {
    return {
      status: 'ok',
      message: 'Product Health Intelligence API is running',
    };
  }
}

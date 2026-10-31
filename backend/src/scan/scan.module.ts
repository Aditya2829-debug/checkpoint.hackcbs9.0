import { Module } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';
import { ThrottlerModule } from '@nestjs/throttler';
import { ProductsModule } from '../products/products.module';
import { RatingModule } from '../rating/rating.module';
import { GeminiModule } from '../gemini/gemini.module';
import { ScanCacheRepository } from './scan-cache.repository';
import { ScanService } from './scan.service';
import { ScanController } from './scan.controller';

@Module({
  imports: [
    ConfigModule,
    ProductsModule,
    RatingModule,
    GeminiModule,
    ThrottlerModule.forRoot([
      {
        ttl: 60000,
        limit: 10,
      },
    ]),
  ],
  controllers: [ScanController],
  providers: [ScanService, ScanCacheRepository],
  exports: [ScanService, ScanCacheRepository],
})
export class ScanModule {}

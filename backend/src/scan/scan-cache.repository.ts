import { Injectable, Logger, OnModuleInit } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { InjectConnection } from '@nestjs/mongoose';
import { Collection, Connection } from 'mongoose';
import { ScanCacheDocument } from './scan.types';

@Injectable()
export class ScanCacheRepository implements OnModuleInit {
  private readonly collection: Collection<ScanCacheDocument>;
  private readonly logger = new Logger(ScanCacheRepository.name);

  constructor(
    @InjectConnection() private readonly connection: Connection,
    configService: ConfigService,
  ) {
    const collectionName =
      configService.get<string>('SCAN_CACHE_COLLECTION')?.trim() ||
      'scan_cache';
    this.collection = connection.collection<ScanCacheDocument>(collectionName);
  }

  async onModuleInit(): Promise<void> {
    try {
      if (this.connection.readyState === 1) {
        await this.collection.createIndex(
          { barcode: 1 },
          { unique: true, name: 'barcode_unique' },
        );
        this.logger.log('Scan cache unique barcode index verified.');
      }
    } catch (err: any) {
      this.logger.warn(`Could not create scan_cache index: ${err.message}`);
    }
  }

  async findByBarcode(barcode: string): Promise<ScanCacheDocument | null> {
    const doc = await this.collection.findOne({ barcode });
    return doc ?? null;
  }

  async save(data: {
    barcode: string;
    extraction: any;
    category: string;
    createdAt: Date;
    source: 'gemini';
  }): Promise<void> {
    await this.collection.updateOne(
      { barcode: data.barcode },
      { $set: data },
      { upsert: true },
    );
  }
}

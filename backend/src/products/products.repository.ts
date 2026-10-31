import { Injectable } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { InjectConnection } from '@nestjs/mongoose';
import { Collection, Connection } from 'mongoose';

@Injectable()
export class ProductsRepository {
  private readonly collection: Collection;

  constructor(
    @InjectConnection() connection: Connection,
    configService: ConfigService,
  ) {
    const collectionName = configService
      .get<string>('MONGODB_COLLECTION')
      ?.trim();

    if (!collectionName) {
      throw new Error(
        'Missing required environment variable: MONGODB_COLLECTION',
      );
    }

    this.collection = connection.collection(collectionName);
  }

  async findPage(
    skip: number,
    limit: number,
  ): Promise<{ items: Record<string, unknown>[]; total: number }> {
    const [items, total] = await Promise.all([
      this.collection.find({}).skip(skip).limit(limit).toArray(),
      this.collection.countDocuments(),
    ]);

    return {
      items: items,
      total,
    };
  }

  async findByProductId(
    productId: string,
  ): Promise<Record<string, unknown> | null> {
    const document = await this.collection.findOne({ productId });
    return document ?? null;
  }
}

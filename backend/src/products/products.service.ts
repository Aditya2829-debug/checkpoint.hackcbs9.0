import { Injectable, NotFoundException } from '@nestjs/common';
import { Types } from 'mongoose';
import { ListProductsQueryDto } from './dto/list-products.query.dto';
import { ProductsRepository } from './products.repository';

@Injectable()
export class ProductsService {
  constructor(private readonly productsRepository: ProductsRepository) {}

  async findAll(query: ListProductsQueryDto) {
    const page = query.page ?? 1;
    const limit = query.limit ?? 20;
    const skip = (page - 1) * limit;

    const { items, total } = await this.productsRepository.findPage(
      skip,
      limit,
    );

    return {
      data: items.map((item) => this.serialize(item)),
      page,
      limit,
      total,
      totalPages: limit > 0 ? Math.ceil(total / limit) : 0,
    };
  }

  async findByProductId(productId: string) {
    const product = await this.productsRepository.findByProductId(productId);

    if (!product) {
      throw new NotFoundException(
        `Product not found for productId "${productId}"`,
      );
    }

    return this.serialize(product);
  }

  private serialize(document: Record<string, unknown>) {
    const serialized: Record<string, unknown> = { ...document };

    if (serialized._id instanceof Types.ObjectId) {
      serialized._id = serialized._id.toHexString();
    } else if (
      serialized._id &&
      typeof serialized._id === 'object' &&
      'toString' in serialized._id &&
      typeof serialized._id.toString === 'function'
    ) {
      serialized._id = serialized._id.toString();
    }

    return serialized;
  }
}

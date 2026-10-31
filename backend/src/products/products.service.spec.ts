import { NotFoundException } from '@nestjs/common';
import { Test, TestingModule } from '@nestjs/testing';
import { ProductsRepository } from './products.repository';
import { ProductsService } from './products.service';

describe('ProductsService', () => {
  let service: ProductsService;
  let repository: {
    findPage: jest.Mock;
    findByProductId: jest.Mock;
  };

  beforeEach(async () => {
    repository = {
      findPage: jest.fn(),
      findByProductId: jest.fn(),
    };

    const module: TestingModule = await Test.createTestingModule({
      providers: [
        ProductsService,
        { provide: ProductsRepository, useValue: repository },
      ],
    }).compile();

    service = module.get<ProductsService>(ProductsService);
  });

  it('returns paginated products and total count', async () => {
    repository.findPage.mockResolvedValue({
      items: [
        { _id: { toString: () => 'abc' }, productId: 'p-1', name: 'Milk' },
      ],
      total: 1,
    });

    await expect(service.findAll({ page: 1, limit: 20 })).resolves.toEqual({
      data: [{ _id: 'abc', productId: 'p-1', name: 'Milk' }],
      page: 1,
      limit: 20,
      total: 1,
      totalPages: 1,
    });
  });

  it('looks up products by custom productId, not Mongo _id', async () => {
    repository.findByProductId.mockResolvedValue({
      _id: { toString: () => 'mongo-id' },
      productId: 'existing-product',
    });

    await expect(service.findByProductId('existing-product')).resolves.toEqual({
      _id: 'mongo-id',
      productId: 'existing-product',
    });
    expect(repository.findByProductId).toHaveBeenCalledWith('existing-product');
  });

  it('throws NotFoundException when the product does not exist', async () => {
    repository.findByProductId.mockResolvedValue(null);

    await expect(service.findByProductId('missing')).rejects.toBeInstanceOf(
      NotFoundException,
    );
  });
});

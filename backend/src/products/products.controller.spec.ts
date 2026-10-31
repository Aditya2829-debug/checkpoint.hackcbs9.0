import { Test, TestingModule } from '@nestjs/testing';
import { CreateProductDto } from './dto/create-product.dto';
import { ListProductsQueryDto } from './dto/list-products.query.dto';
import { ProductsController } from './products.controller';
import { ProductsService } from './products.service';

describe('ProductsController', () => {
  let controller: ProductsController;
  let service: {
    create: jest.Mock;
    findAll: jest.Mock;
    findByProductId: jest.Mock;
    findByBarcode: jest.Mock;
  };

  beforeEach(async () => {
    service = {
      create: jest.fn(),
      findAll: jest.fn(),
      findByProductId: jest.fn(),
      findByBarcode: jest.fn(),
    };

    const module: TestingModule = await Test.createTestingModule({
      controllers: [ProductsController],
      providers: [{ provide: ProductsService, useValue: service }],
    }).compile();

    controller = module.get<ProductsController>(ProductsController);
  });

  it('should delegate create() to ProductsService.create', async () => {
    const dto: CreateProductDto = {
      productId: 'p-1',
      name: 'Test Product',
      brand: 'Test Brand',
      category: 'SNACKS',
    };
    service.create.mockResolvedValue({ ...dto, _id: 'id-1' });

    const result = await controller.create(dto);
    expect(result).toEqual({ ...dto, _id: 'id-1' });
    expect(service.create).toHaveBeenCalledWith(dto);
  });

  it('should delegate findAll() to ProductsService.findAll', async () => {
    const query: ListProductsQueryDto = {
      page: 1,
      limit: 10,
      category: 'SNACKS',
    };
    const expected = { data: [], page: 1, limit: 10, total: 0, totalPages: 0 };
    service.findAll.mockResolvedValue(expected);

    const result = await controller.findAll(query);
    expect(result).toEqual(expected);
    expect(service.findAll).toHaveBeenCalledWith(query);
  });

  it('should delegate findByBarcode() to ProductsService.findByBarcode', async () => {
    const product = { productId: 'p-1', barcode: '8901234567890' };
    service.findByBarcode.mockResolvedValue(product);

    const result = await controller.findByBarcode('8901234567890');
    expect(result).toEqual(product);
    expect(service.findByBarcode).toHaveBeenCalledWith('8901234567890');
  });

  it('should delegate findOne() to ProductsService.findByProductId', async () => {
    const product = { productId: 'p-1', name: 'Product 1' };
    service.findByProductId.mockResolvedValue(product);

    const result = await controller.findOne('p-1');
    expect(result).toEqual(product);
    expect(service.findByProductId).toHaveBeenCalledWith('p-1');
  });
});

import {
  BadRequestException,
  ConflictException,
  NotFoundException,
} from '@nestjs/common';
import { Test, TestingModule } from '@nestjs/testing';
import { plainToInstance } from 'class-transformer';
import { validate } from 'class-validator';
import { CreateProductDto } from './dto/create-product.dto';
import { ProductsRepository } from './products.repository';
import { ProductsService } from './products.service';

describe('ProductsService', () => {
  let service: ProductsService;
  let repository: {
    findPage: jest.Mock;
    findByProductId: jest.Mock;
    findByBarcode: jest.Mock;
    create: jest.Mock;
  };

  beforeEach(async () => {
    repository = {
      findPage: jest.fn(),
      findByProductId: jest.fn(),
      findByBarcode: jest.fn(),
      create: jest.fn(),
    };

    const module: TestingModule = await Test.createTestingModule({
      providers: [
        ProductsService,
        { provide: ProductsRepository, useValue: repository },
      ],
    }).compile();

    service = module.get<ProductsService>(ProductsService);
  });

  // ─── 1. Product Retrieval ────────────────────────────────────────────────

  describe('findAll', () => {
    it('returns paginated products and total count', async () => {
      repository.findPage.mockResolvedValue({
        items: [
          { _id: { toString: () => 'abc' }, productId: 'p-1', name: 'Milk' },
        ],
        total: 1,
      });

      const result = await service.findAll({ page: 1, limit: 20 });
      expect(result).toEqual({
        data: [{ _id: 'abc', productId: 'p-1', name: 'Milk' }],
        page: 1,
        limit: 20,
        total: 1,
        totalPages: 1,
      });
      expect(repository.findPage).toHaveBeenCalledWith(0, 20, {
        category: undefined,
        brand: undefined,
      });
    });

    it('passes category and brand filters to repository', async () => {
      repository.findPage.mockResolvedValue({ items: [], total: 0 });

      await service.findAll({
        page: 2,
        limit: 10,
        category: 'BISCUIT',
        brand: 'Britannia',
      });

      expect(repository.findPage).toHaveBeenCalledWith(10, 10, {
        category: 'BISCUIT',
        brand: 'Britannia',
      });
    });
  });

  describe('findByProductId', () => {
    it('looks up products by custom productId, not Mongo _id', async () => {
      repository.findByProductId.mockResolvedValue({
        _id: { toString: () => 'mongo-id' },
        productId: 'existing-product',
      });

      await expect(
        service.findByProductId('existing-product'),
      ).resolves.toEqual({
        _id: 'mongo-id',
        productId: 'existing-product',
      });
      expect(repository.findByProductId).toHaveBeenCalledWith(
        'existing-product',
      );
    });

    it('throws NotFoundException when the product does not exist', async () => {
      repository.findByProductId.mockResolvedValue(null);

      await expect(service.findByProductId('missing')).rejects.toBeInstanceOf(
        NotFoundException,
      );
    });
  });

  // ─── 2. Search Products by Barcode ───────────────────────────────────────

  describe('findByBarcode', () => {
    it('finds an existing product by exact barcode', async () => {
      repository.findByBarcode.mockResolvedValue({
        _id: { toString: () => 'mongo-id-123' },
        productId: 'prod-100',
        name: 'Oats Cookie',
        barcode: '8901234567890',
      });

      const result = await service.findByBarcode('8901234567890');
      expect(result).toEqual({
        _id: 'mongo-id-123',
        productId: 'prod-100',
        name: 'Oats Cookie',
        barcode: '8901234567890',
      });
      expect(repository.findByBarcode).toHaveBeenCalledWith('8901234567890');
    });

    it('normalizes incoming barcode by trimming whitespace', async () => {
      repository.findByBarcode.mockResolvedValue({
        _id: { toString: () => 'mongo-id-123' },
        productId: 'prod-100',
        barcode: '8901234567890',
      });

      await service.findByBarcode('  8901234567890  \t');
      expect(repository.findByBarcode).toHaveBeenCalledWith('8901234567890');
    });

    it('throws NotFoundException (404) when no product matches the barcode', async () => {
      repository.findByBarcode.mockResolvedValue(null);

      await expect(
        service.findByBarcode('8901234567890'),
      ).rejects.toBeInstanceOf(NotFoundException);
    });

    it('throws BadRequestException (400) for invalid barcode input (letters)', async () => {
      await expect(
        service.findByBarcode('invalid-barcode'),
      ).rejects.toBeInstanceOf(BadRequestException);
      expect(repository.findByBarcode).not.toHaveBeenCalled();
    });

    it('throws BadRequestException (400) for too short barcode', async () => {
      await expect(service.findByBarcode('12345')).rejects.toBeInstanceOf(
        BadRequestException,
      );
      expect(repository.findByBarcode).not.toHaveBeenCalled();
    });

    it('throws BadRequestException (400) for too long barcode (>20 digits)', async () => {
      await expect(
        service.findByBarcode('123456789012345678901'),
      ).rejects.toBeInstanceOf(BadRequestException);
      expect(repository.findByBarcode).not.toHaveBeenCalled();
    });

    it('performs exact matching only, not regex or fuzzy search', async () => {
      repository.findByBarcode.mockResolvedValue(null);
      await expect(service.findByBarcode('8901234567890')).rejects.toThrow();
      expect(repository.findByBarcode).toHaveBeenCalledWith('8901234567890');
    });
  });

  // ─── 3. Product Creation ─────────────────────────────────────────────────

  describe('create', () => {
    const validDto: CreateProductDto = {
      productId: 'new-product-1',
      name: 'Dark Chocolate Cookie',
      brand: 'ChocoBrand',
      category: 'BISCUIT',
      subCategory: 'COOKIES',
      barcode: '8901234567890',
      ingredientsText: 'Wheat flour, cocoa, sugar',
      priceINR: 40,
      servingSizeG: 100,
      nutrition: {
        caloriesKcal: 450,
        carbs: 65,
        protein: 6,
        totalFat: 15,
      },
    };

    it('successfully creates and returns the product', async () => {
      const createdDoc = {
        ...validDto,
        _id: { toString: () => 'new-mongo-id' },
        createdAt: new Date(),
        updatedAt: new Date(),
      };
      repository.create.mockResolvedValue(createdDoc);

      const result = await service.create(validDto);
      expect(result._id).toBe('new-mongo-id');
      expect(result.productId).toBe('new-product-1');
      expect(repository.create).toHaveBeenCalledWith(validDto);
    });

    it('rejects duplicate productId with ConflictException (409)', async () => {
      repository.create.mockRejectedValue(
        new ConflictException(
          'A product with productId "new-product-1" already exists',
        ),
      );

      await expect(service.create(validDto)).rejects.toBeInstanceOf(
        ConflictException,
      );
    });

    it('rejects duplicate barcode with ConflictException (409)', async () => {
      repository.create.mockRejectedValue(
        new ConflictException(
          'A product with barcode "8901234567890" already exists',
        ),
      );

      await expect(service.create(validDto)).rejects.toBeInstanceOf(
        ConflictException,
      );
    });
  });
});

// ─── 4. DTO Validation Tests ───────────────────────────────────────────────

describe('CreateProductDto Validation', () => {
  it('validates a correct payload successfully', async () => {
    const plain = {
      productId: 'prod-001',
      name: 'Almond Biscuit',
      brand: 'NutriBite',
      category: 'BISCUIT',
      subCategory: 'COOKIES',
      barcode: '8901234567890',
      ingredientsText: 'Wheat, Almonds',
      priceINR: 50,
      servingSizeG: 75,
      nutrition: {
        caloriesKcal: 400,
        protein: 8,
      },
    };

    const dto = plainToInstance(CreateProductDto, plain);
    const errors = await validate(dto);
    expect(errors.length).toBe(0);
  });

  it('fails when essential fields are missing', async () => {
    const plain = {
      // missing productId, name, brand, category
      subCategory: 'COOKIES',
    };

    const dto = plainToInstance(CreateProductDto, plain);
    const errors = await validate(dto);
    const errorProperties = errors.map((e) => e.property);

    expect(errorProperties).toContain('productId');
    expect(errorProperties).toContain('name');
    expect(errorProperties).toContain('brand');
    expect(errorProperties).toContain('category');
  });

  it('fails when barcode is invalid format (non-numeric)', async () => {
    const plain = {
      productId: 'prod-002',
      name: 'Product 2',
      brand: 'Brand',
      category: 'SNACKS',
      barcode: 'not-a-barcode',
    };

    const dto = plainToInstance(CreateProductDto, plain);
    const errors = await validate(dto);
    const barcodeError = errors.find((e) => e.property === 'barcode');

    expect(barcodeError).toBeDefined();
  });

  it('fails when barcode is too short (< 8 digits)', async () => {
    const plain = {
      productId: 'prod-003',
      name: 'Product 3',
      brand: 'Brand',
      category: 'SNACKS',
      barcode: '1234567',
    };

    const dto = plainToInstance(CreateProductDto, plain);
    const errors = await validate(dto);
    const barcodeError = errors.find((e) => e.property === 'barcode');

    expect(barcodeError).toBeDefined();
  });

  it('normalizes whitespace around barcode during transformation', async () => {
    const plain = {
      productId: 'prod-004',
      name: 'Product 4',
      brand: 'Brand',
      category: 'SNACKS',
      barcode: '  8901234567890  ',
    };

    const dto = plainToInstance(CreateProductDto, plain);
    const errors = await validate(dto);

    expect(errors.length).toBe(0);
    expect(dto.barcode).toBe('8901234567890');
  });
});

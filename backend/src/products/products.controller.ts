import {
  Body,
  Controller,
  Get,
  HttpCode,
  HttpStatus,
  Param,
  Post,
  Query,
} from '@nestjs/common';
import { CreateProductDto } from './dto/create-product.dto';
import { ListProductsQueryDto } from './dto/list-products.query.dto';
import { ProductsService } from './products.service';

/**
 * ProductsController
 *
 * Route ordering:
 *   GET /barcode/:barcode must precede GET /:productId so Express does not
 *   treat the literal string "barcode" as a productId route parameter.
 *
 * Auth Integration:
 *   The POST endpoint is marked for JWT authorization before production deployment.
 *   All read endpoints remain public.
 */
@Controller('products')
export class ProductsController {
  constructor(private readonly productsService: ProductsService) {}

  // ── POST /api/v1/products ─────────────────────────────────────────────
  // TODO(auth): Attach @UseGuards(JwtAuthGuard) here when auth module is ready.
  @Post()
  @HttpCode(HttpStatus.CREATED)
  create(@Body() dto: CreateProductDto) {
    return this.productsService.create(dto);
  }

  // ── GET /api/v1/products ──────────────────────────────────────────────
  @Get()
  findAll(@Query() query: ListProductsQueryDto) {
    return this.productsService.findAll(query);
  }

  // ── GET /api/v1/products/barcode/:barcode ─────────────────────────────
  // Must be declared before /:productId to avoid route parameter collision.
  @Get('barcode/:barcode')
  findByBarcode(@Param('barcode') barcode: string) {
    return this.productsService.findByBarcode(barcode);
  }

  // ── GET /api/v1/products/:productId ───────────────────────────────────
  @Get(':productId')
  findOne(@Param('productId') productId: string) {
    return this.productsService.findByProductId(productId);
  }
}

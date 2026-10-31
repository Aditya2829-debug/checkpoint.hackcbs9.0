import { Transform, Type } from 'class-transformer';
import {
  IsNotEmpty,
  IsNumber,
  IsOptional,
  IsString,
  Matches,
  Min,
  ValidateNested,
} from 'class-validator';

export class NutritionDto {
  @IsOptional()
  @IsNumber()
  @Min(0)
  caloriesKcal?: number;

  @IsOptional()
  @IsNumber()
  @Min(0)
  carbs?: number;

  @IsOptional()
  @IsNumber()
  @Min(0)
  protein?: number;

  @IsOptional()
  @IsNumber()
  @Min(0)
  totalFat?: number;

  @IsOptional()
  @IsNumber()
  @Min(0)
  satFat?: number;

  @IsOptional()
  @IsNumber()
  @Min(0)
  transFat?: number;

  @IsOptional()
  @IsNumber()
  @Min(0)
  sugars?: number;

  @IsOptional()
  @IsNumber()
  @Min(0)
  sodiumMg?: number;
}

export class CreateProductDto {
  @Transform(({ value }) => (typeof value === 'string' ? value.trim() : value))
  @IsString()
  @IsNotEmpty()
  productId!: string;

  @Transform(({ value }) => (typeof value === 'string' ? value.trim() : value))
  @IsString()
  @IsNotEmpty()
  name!: string;

  @Transform(({ value }) => (typeof value === 'string' ? value.trim() : value))
  @IsString()
  @IsNotEmpty()
  brand!: string;

  @Transform(({ value }) => (typeof value === 'string' ? value.trim() : value))
  @IsString()
  @IsNotEmpty()
  category!: string;

  @IsOptional()
  @Transform(({ value }) => (typeof value === 'string' ? value.trim() : value))
  @IsString()
  subCategory?: string;

  /**
   * Barcode (EAN-8, EAN-13, UPC-A or any numeric string of 8–20 digits).
   * Whitespace is trimmed before validation and storage.
   */
  @IsOptional()
  @Transform(({ value }) => (typeof value === 'string' ? value.trim() : value))
  @IsString()
  @Matches(/^\d{8,20}$/, {
    message: 'barcode must be a numeric string of 8–20 digits',
  })
  barcode?: string;

  @IsOptional()
  @IsString()
  ingredientsText?: string;

  @IsOptional()
  @IsNumber()
  @Min(0)
  priceINR?: number;

  @IsOptional()
  @IsNumber()
  @Min(0)
  servingSizeG?: number;

  @IsOptional()
  @ValidateNested()
  @Type(() => NutritionDto)
  nutrition?: NutritionDto;
}

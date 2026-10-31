import { Type } from 'class-transformer';
import { IsInt, IsOptional, IsString, Max, Min } from 'class-validator';

export class ListProductsQueryDto {
  @IsOptional()
  @Type(() => Number)
  @IsInt()
  @Min(1)
  page = 1;

  @IsOptional()
  @Type(() => Number)
  @IsInt()
  @Min(1)
  @Max(100)
  limit = 20;

  /** Optional exact-match filter on the `category` field. */
  @IsOptional()
  @IsString()
  category?: string;

  /** Optional case-insensitive filter on the `brand` field. */
  @IsOptional()
  @IsString()
  brand?: string;
}

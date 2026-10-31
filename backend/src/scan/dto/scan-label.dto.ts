import {
  IsIn,
  IsNotEmpty,
  IsOptional,
  IsString,
  Matches,
  MaxLength,
} from 'class-validator';

export class ScanLabelDto {
  @IsString()
  @IsNotEmpty()
  @Matches(/^\d{8,14}$/, {
    message: 'Barcode must be between 8 and 14 digits.',
  })
  barcode!: string;

  @IsString()
  @IsNotEmpty()
  @MaxLength(10_000_000, {
    message: 'Image base64 payload cannot exceed 10 MB.',
  })
  imageBase64!: string;

  @IsString()
  @IsNotEmpty()
  @IsIn(['image/jpeg', 'image/png', 'image/webp'], {
    message: 'mimeType must be image/jpeg, image/png, or image/webp.',
  })
  mimeType!: 'image/jpeg' | 'image/png' | 'image/webp';

  @IsOptional()
  @IsIn(['food', 'period', 'pregnancy'], {
    message: 'categoryHint must be food, period, or pregnancy.',
  })
  categoryHint?: 'food' | 'period' | 'pregnancy';
}

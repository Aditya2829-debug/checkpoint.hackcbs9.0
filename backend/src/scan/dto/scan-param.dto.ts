import { IsNotEmpty, IsString, Matches } from 'class-validator';

export class ScanParamDto {
  @IsString()
  @IsNotEmpty()
  @Matches(/^\d{8,14}$/, {
    message: 'Barcode must be between 8 and 14 digits.',
  })
  barcode!: string;
}

import {
  Body,
  Controller,
  Get,
  HttpCode,
  HttpStatus,
  Param,
  Post,
  UseGuards,
} from '@nestjs/common';
import { Throttle, ThrottlerGuard } from '@nestjs/throttler';
import { ScanParamDto } from './dto/scan-param.dto';
import { ScanLabelDto } from './dto/scan-label.dto';
import { ScanService } from './scan.service';
import { ScanResponse } from './scan.types';

@Controller('scan')
export class ScanController {
  constructor(private readonly scanService: ScanService) {}

  @Get(':barcode')
  async scanBarcode(@Param() params: ScanParamDto): Promise<ScanResponse> {
    return this.scanService.scan({ barcode: params.barcode });
  }

  @Post('label')
  @HttpCode(HttpStatus.OK)
  @UseGuards(ThrottlerGuard)
  @Throttle({ default: { limit: 10, ttl: 60000 } })
  async scanLabel(@Body() dto: ScanLabelDto): Promise<ScanResponse> {
    return this.scanService.scan({
      barcode: dto.barcode,
      image: {
        imageBase64: dto.imageBase64,
        mimeType: dto.mimeType,
      },
      categoryHint: dto.categoryHint,
    });
  }
}

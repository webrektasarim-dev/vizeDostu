import { IsString, IsNumber, IsOptional } from 'class-validator';
import { ApiProperty } from '@nestjs/swagger';

export class InitUploadDto {
  @ApiProperty({ example: 'passport.pdf' })
  @IsString()
  fileName: string;

  @ApiProperty({ example: 10485760 })
  @IsNumber()
  fileSize: number;

  @ApiProperty({ example: 'passport' })
  @IsString()
  documentType: string;

  @ApiProperty({ example: 'Fransa', required: false })
  @IsOptional()
  @IsString()
  country?: string;
}



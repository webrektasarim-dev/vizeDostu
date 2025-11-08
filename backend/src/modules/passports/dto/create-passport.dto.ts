import { IsString, IsDateString, IsOptional } from 'class-validator';
import { ApiProperty } from '@nestjs/swagger';

export class CreatePassportDto {
  @ApiProperty({ example: 'U12345678' })
  @IsString()
  passportNumber: string;

  @ApiProperty({ example: '2020-01-15' })
  @IsDateString()
  issueDate: string;

  @ApiProperty({ example: '2030-01-15' })
  @IsDateString()
  expiryDate: string;

  @ApiProperty({ example: 'TUR' })
  @IsString()
  issuingCountry: string;

  @ApiProperty({ required: false })
  @IsOptional()
  @IsString()
  documentId?: string;
}



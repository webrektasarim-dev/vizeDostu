import { IsString, IsOptional } from 'class-validator';
import { ApiProperty } from '@nestjs/swagger';

export class CreateApplicationDto {
  @ApiProperty({ example: 'Fransa' })
  @IsString()
  country: string;

  @ApiProperty({ example: 'tourist', enum: ['tourist', 'business', 'student', 'work'] })
  @IsString()
  visaType: string;

  @ApiProperty({ example: 'Notlar...', required: false })
  @IsString()
  @IsOptional()
  notes?: string;
}



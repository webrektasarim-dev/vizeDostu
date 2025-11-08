import { IsString, IsDateString, IsOptional, IsEnum } from 'class-validator';
import { ApiProperty } from '@nestjs/swagger';
import { AppointmentType } from '@prisma/client';

export class CreateAppointmentDto {
  @ApiProperty({ required: false })
  @IsOptional()
  @IsString()
  applicationId?: string;

  @ApiProperty({ example: 'VISA', enum: AppointmentType })
  @IsEnum(AppointmentType)
  appointmentType: AppointmentType;

  @ApiProperty({ example: '2024-12-15T10:00:00Z' })
  @IsDateString()
  appointmentDate: string;

  @ApiProperty({ example: 'Fransa Konsolosluğu, İstanbul' })
  @IsString()
  location: string;

  @ApiProperty({ required: false })
  @IsOptional()
  @IsString()
  notes?: string;
}



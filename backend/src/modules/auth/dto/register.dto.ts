import { IsEmail, IsString, MinLength, IsOptional } from 'class-validator';
import { ApiProperty } from '@nestjs/swagger';

export class RegisterDto {
  @ApiProperty({ example: 'ozan@example.com' })
  @IsEmail()
  email: string;

  @ApiProperty({ example: 'SecurePassword123!' })
  @IsString()
  @MinLength(6)
  password: string;

  @ApiProperty({ example: 'Ozan Yılmaz' })
  @IsString()
  fullName: string;

  @ApiProperty({ example: '+905551234567', required: false })
  @IsOptional()
  @IsString()
  phoneNumber?: string;
}



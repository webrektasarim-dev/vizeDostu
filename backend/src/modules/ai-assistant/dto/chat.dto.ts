import { IsString, MinLength } from 'class-validator';
import { ApiProperty } from '@nestjs/swagger';

export class ChatDto {
  @ApiProperty({ example: 'İtalya\'ya turistik vize almak istiyorum, ne yapmam gerekiyor?' })
  @IsString()
  @MinLength(1)
  message: string;
}



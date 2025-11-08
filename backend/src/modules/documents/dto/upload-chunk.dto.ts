import { IsNumber, IsString } from 'class-validator';
import { ApiProperty } from '@nestjs/swagger';

export class UploadChunkDto {
  @ApiProperty({ example: 0 })
  @IsNumber()
  chunkIndex: number;

  @ApiProperty({ description: 'Base64 encoded chunk data' })
  @IsString()
  chunkData: string;
}



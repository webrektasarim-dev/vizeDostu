import {
  Controller,
  Get,
  Post,
  Delete,
  Body,
  Param,
  Query,
  UseGuards,
  UseInterceptors,
  UploadedFile,
} from '@nestjs/common';
import { FileInterceptor } from '@nestjs/platform-express';
import { ApiTags, ApiOperation, ApiBearerAuth, ApiConsumes } from '@nestjs/swagger';
import { JwtAuthGuard } from '../../common/guards/jwt-auth.guard';
import { CurrentUser } from '../../common/decorators/current-user.decorator';
import { DocumentsService } from './documents.service';
import { InitUploadDto } from './dto/init-upload.dto';
import { UploadChunkDto } from './dto/upload-chunk.dto';

@ApiTags('documents')
@ApiBearerAuth()
@UseGuards(JwtAuthGuard)
@Controller('documents')
export class DocumentsController {
  constructor(private documentsService: DocumentsService) {}

  @Post('init-upload')
  @ApiOperation({ summary: 'Chunk upload başlat' })
  async initUpload(@CurrentUser() user: any, @Body() initUploadDto: InitUploadDto) {
    return this.documentsService.initializeUpload(
      user.userId,
      initUploadDto.fileName,
      initUploadDto.fileSize,
      initUploadDto.documentType,
      initUploadDto.country,
    );
  }

  @Post('upload-chunk/:sessionId')
  @ApiOperation({ summary: 'Chunk yükle' })
  async uploadChunk(
    @Param('sessionId') sessionId: string,
    @Body() uploadChunkDto: UploadChunkDto,
  ) {
    return this.documentsService.uploadChunk(
      sessionId,
      uploadChunkDto.chunkIndex,
      uploadChunkDto.chunkData,
    );
  }

  @Post('complete-upload/:sessionId')
  @ApiOperation({ summary: 'Upload\'ı tamamla' })
  async completeUpload(@Param('sessionId') sessionId: string) {
    return this.documentsService.completeUpload(sessionId);
  }

  @Post('upload')
  @ApiOperation({ summary: 'Direkt dosya yükle (küçük dosyalar)' })
  @ApiConsumes('multipart/form-data')
  @UseInterceptors(FileInterceptor('file'))
  async directUpload(
    @CurrentUser() user: any,
    @UploadedFile() file: Express.Multer.File,
    @Body('documentType') documentType: string,
    @Body('country') country?: string,
  ) {
    return this.documentsService.directUpload(user.userId, file, documentType, country);
  }

  @Get()
  @ApiOperation({ summary: 'Belgeleri listele' })
  async getDocuments(@CurrentUser() user: any, @Query('country') country?: string) {
    return this.documentsService.getDocuments(user.userId, country);
  }

  @Get(':id')
  @ApiOperation({ summary: 'Belge detayı' })
  async getDocument(@CurrentUser() user: any, @Param('id') id: string) {
    return this.documentsService.getDocument(user.userId, id);
  }

  @Get(':id/download')
  @ApiOperation({ summary: 'Belge indirme URL\'i al' })
  async getDownloadUrl(@CurrentUser() user: any, @Param('id') id: string) {
    return this.documentsService.getDownloadUrl(user.userId, id);
  }

  @Delete(':id')
  @ApiOperation({ summary: 'Belge sil' })
  async deleteDocument(@CurrentUser() user: any, @Param('id') id: string) {
    return this.documentsService.deleteDocument(user.userId, id);
  }
}



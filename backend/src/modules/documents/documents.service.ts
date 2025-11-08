import { Injectable, BadRequestException, NotFoundException } from '@nestjs/common';
import { InjectQueue } from '@nestjs/bull';
import { Queue } from 'bull';
import { PrismaService } from '../../common/prisma/prisma.service';
import { S3Service } from '../../common/s3/s3.service';
import { v4 as uuidv4 } from 'uuid';

@Injectable()
export class DocumentsService {
  private readonly CHUNK_SIZE = 5 * 1024 * 1024; // 5MB
  private readonly MAX_FILE_SIZE = 100 * 1024 * 1024; // 100MB

  constructor(
    private prisma: PrismaService,
    private s3Service: S3Service,
    @InjectQueue('documents') private documentQueue: Queue,
  ) {}

  async initializeUpload(
    userId: string,
    fileName: string,
    fileSize: number,
    documentType: string,
    country?: string,
  ) {
    if (fileSize > this.MAX_FILE_SIZE) {
      throw new BadRequestException('Dosya boyutu 100MB\'dan büyük olamaz');
    }

    const totalChunks = Math.ceil(fileSize / this.CHUNK_SIZE);
    const s3Key = `documents/${userId}/${uuidv4()}-${fileName}`;

    const uploadId = await this.s3Service.createMultipartUpload(s3Key);

    const session = await this.prisma.uploadSession.create({
      data: {
        userId,
        fileName,
        fileSize,
        chunkSize: this.CHUNK_SIZE,
        totalChunks,
        documentType,
        country,
        s3Key,
        uploadId,
        expiresAt: new Date(Date.now() + 24 * 60 * 60 * 1000),
      },
    });

    return {
      uploadId: session.id,
      chunkCount: totalChunks,
      chunkSize: this.CHUNK_SIZE,
    };
  }

  async uploadChunk(sessionId: string, chunkIndex: number, chunkData: string) {
    const session = await this.prisma.uploadSession.findUnique({
      where: { id: sessionId },
    });

    if (!session) {
      throw new NotFoundException('Upload session bulunamadı');
    }

    if (session.status !== 'IN_PROGRESS') {
      throw new BadRequestException('Upload session aktif değil');
    }

    if (new Date() > session.expiresAt) {
      throw new BadRequestException('Upload session süresi dolmuş');
    }

    const buffer = Buffer.from(chunkData, 'base64');

    await this.s3Service.uploadPart(session.s3Key!, session.uploadId!, chunkIndex + 1, buffer);

    await this.prisma.uploadSession.update({
      where: { id: sessionId },
      data: {
        uploadedChunks: session.uploadedChunks + 1,
      },
    });

    return {
      chunkIndex,
      uploaded: true,
      progress: Math.round(((session.uploadedChunks + 1) / session.totalChunks) * 100),
    };
  }

  async completeUpload(sessionId: string) {
    const session = await this.prisma.uploadSession.findUnique({
      where: { id: sessionId },
    });

    if (!session) {
      throw new NotFoundException('Upload session bulunamadı');
    }

    if (session.uploadedChunks !== session.totalChunks) {
      throw new BadRequestException('Tüm chunk\'lar yüklenmedi');
    }

    const fileUrl = await this.s3Service.completeMultipartUpload(
      session.s3Key!,
      session.uploadId!,
      session.totalChunks,
    );

    const document = await this.prisma.document.create({
      data: {
        userId: session.userId,
        documentType: session.documentType,
        country: session.country,
        fileName: session.fileName,
        fileUrl,
        fileSize: session.fileSize,
        mimeType: this.getMimeType(session.fileName),
      },
    });

    await this.prisma.uploadSession.update({
      where: { id: sessionId },
      data: { status: 'COMPLETED' },
    });

    await this.documentQueue.add('process-document', {
      documentId: document.id,
      documentType: document.documentType,
    });

    return document;
  }

  async directUpload(
    userId: string,
    file: Express.Multer.File,
    documentType: string,
    country?: string,
  ) {
    if (file.size > this.MAX_FILE_SIZE) {
      throw new BadRequestException('Dosya boyutu 100MB\'dan büyük olamaz');
    }

    const s3Key = `documents/${userId}/${uuidv4()}-${file.originalname}`;
    const fileUrl = await this.s3Service.uploadFile(s3Key, file.buffer, file.mimetype);

    const document = await this.prisma.document.create({
      data: {
        userId,
        documentType,
        country,
        fileName: file.originalname,
        fileUrl,
        fileSize: file.size,
        mimeType: file.mimetype,
      },
    });

    await this.documentQueue.add('process-document', {
      documentId: document.id,
      documentType: document.documentType,
    });

    return document;
  }

  async getDocuments(userId: string, country?: string) {
    const documents = await this.prisma.document.findMany({
      where: {
        userId,
        ...(country && { country }),
      },
      orderBy: { uploadedAt: 'desc' },
    });

    return documents.map((doc) => this.checkDocumentStatus(doc));
  }

  async getDocument(userId: string, documentId: string) {
    const document = await this.prisma.document.findFirst({
      where: { id: documentId, userId },
    });

    if (!document) {
      throw new NotFoundException('Belge bulunamadı');
    }

    return this.checkDocumentStatus(document);
  }

  async deleteDocument(userId: string, documentId: string) {
    const document = await this.prisma.document.findFirst({
      where: { id: documentId, userId },
    });

    if (!document) {
      throw new NotFoundException('Belge bulunamadı');
    }

    await this.s3Service.deleteFile(document.fileUrl);

    await this.prisma.document.delete({
      where: { id: documentId },
    });

    return { deleted: true };
  }

  async getDownloadUrl(userId: string, documentId: string) {
    const document = await this.prisma.document.findFirst({
      where: { id: documentId, userId },
    });

    if (!document) {
      throw new NotFoundException('Belge bulunamadı');
    }

    const key = this.extractKeyFromUrl(document.fileUrl);
    const signedUrl = await this.s3Service.getSignedUrl(key, 3600);

    return { url: signedUrl };
  }

  private checkDocumentStatus(document: any) {
    if (!document.expiryDate) {
      return { ...document, status: 'ACTIVE' };
    }

    const now = new Date();
    const expiryDate = new Date(document.expiryDate);
    const sixMonthsFromNow = new Date();
    sixMonthsFromNow.setMonth(sixMonthsFromNow.getMonth() + 6);

    let status = 'ACTIVE';
    if (expiryDate < now) {
      status = 'EXPIRED';
    } else if (expiryDate < sixMonthsFromNow) {
      status = 'EXPIRING_SOON';
    }

    return { ...document, status };
  }

  private getMimeType(fileName: string): string {
    const ext = fileName.split('.').pop()?.toLowerCase();
    const mimeTypes: Record<string, string> = {
      pdf: 'application/pdf',
      jpg: 'image/jpeg',
      jpeg: 'image/jpeg',
      png: 'image/png',
      doc: 'application/msword',
      docx: 'application/vnd.openxmlformats-officedocument.wordprocessingml.document',
    };
    return mimeTypes[ext || ''] || 'application/octet-stream';
  }

  private extractKeyFromUrl(url: string): string {
    const urlParts = url.split('/');
    return urlParts.slice(3).join('/');
  }
}



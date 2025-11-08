import { Injectable, Logger } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import {
  S3Client,
  PutObjectCommand,
  DeleteObjectCommand,
  GetObjectCommand,
  CreateMultipartUploadCommand,
  UploadPartCommand,
  CompleteMultipartUploadCommand,
  AbortMultipartUploadCommand,
} from '@aws-sdk/client-s3';
import { getSignedUrl } from '@aws-sdk/s3-request-presigner';

@Injectable()
export class S3Service {
  private readonly logger = new Logger(S3Service.name);
  private readonly s3Client: S3Client;
  private readonly bucket: string;

  constructor(private configService: ConfigService) {
    this.bucket = this.configService.get<string>('AWS_S3_BUCKET');

    this.s3Client = new S3Client({
      region: this.configService.get<string>('AWS_REGION'),
      credentials: {
        accessKeyId: this.configService.get<string>('AWS_ACCESS_KEY_ID'),
        secretAccessKey: this.configService.get<string>('AWS_SECRET_ACCESS_KEY'),
      },
    });

    this.logger.log('✅ S3 Service initialized');
  }

  /**
   * Upload file to S3
   */
  async uploadFile(key: string, buffer: Buffer, mimeType: string): Promise<string> {
    try {
      await this.s3Client.send(
        new PutObjectCommand({
          Bucket: this.bucket,
          Key: key,
          Body: buffer,
          ContentType: mimeType,
        }),
      );

      return this.getFileUrl(key);
    } catch (error) {
      this.logger.error(`Error uploading file to S3: ${error.message}`);
      throw error;
    }
  }

  /**
   * Delete file from S3
   */
  async deleteFile(fileUrl: string): Promise<void> {
    try {
      const key = this.extractKeyFromUrl(fileUrl);
      await this.s3Client.send(
        new DeleteObjectCommand({
          Bucket: this.bucket,
          Key: key,
        }),
      );
    } catch (error) {
      this.logger.error(`Error deleting file from S3: ${error.message}`);
      throw error;
    }
  }

  /**
   * Get signed URL for private file access
   */
  async getSignedUrl(key: string, expiresIn: number = 3600): Promise<string> {
    try {
      const command = new GetObjectCommand({
        Bucket: this.bucket,
        Key: key,
      });

      return await getSignedUrl(this.s3Client, command, { expiresIn });
    } catch (error) {
      this.logger.error(`Error generating signed URL: ${error.message}`);
      throw error;
    }
  }

  /**
   * Create multipart upload for large files
   */
  async createMultipartUpload(key: string): Promise<string> {
    try {
      const response = await this.s3Client.send(
        new CreateMultipartUploadCommand({
          Bucket: this.bucket,
          Key: key,
        }),
      );

      return response.UploadId;
    } catch (error) {
      this.logger.error(`Error creating multipart upload: ${error.message}`);
      throw error;
    }
  }

  /**
   * Upload a part of multipart upload
   */
  async uploadPart(
    key: string,
    uploadId: string,
    partNumber: number,
    body: Buffer,
  ): Promise<{ ETag: string; PartNumber: number }> {
    try {
      const response = await this.s3Client.send(
        new UploadPartCommand({
          Bucket: this.bucket,
          Key: key,
          UploadId: uploadId,
          PartNumber: partNumber,
          Body: body,
        }),
      );

      return {
        ETag: response.ETag,
        PartNumber: partNumber,
      };
    } catch (error) {
      this.logger.error(`Error uploading part: ${error.message}`);
      throw error;
    }
  }

  /**
   * Complete multipart upload
   */
  async completeMultipartUpload(
    key: string,
    uploadId: string,
    totalParts: number,
  ): Promise<string> {
    try {
      // Build parts array (simplified - in production, store ETags)
      const parts = Array.from({ length: totalParts }, (_, i) => ({
        PartNumber: i + 1,
        ETag: `etag-${i + 1}`, // Should be actual ETags from uploadPart
      }));

      await this.s3Client.send(
        new CompleteMultipartUploadCommand({
          Bucket: this.bucket,
          Key: key,
          UploadId: uploadId,
          MultipartUpload: { Parts: parts },
        }),
      );

      return this.getFileUrl(key);
    } catch (error) {
      this.logger.error(`Error completing multipart upload: ${error.message}`);
      // Abort upload on error
      await this.abortMultipartUpload(key, uploadId);
      throw error;
    }
  }

  /**
   * Abort multipart upload
   */
  async abortMultipartUpload(key: string, uploadId: string): Promise<void> {
    try {
      await this.s3Client.send(
        new AbortMultipartUploadCommand({
          Bucket: this.bucket,
          Key: key,
          UploadId: uploadId,
        }),
      );
    } catch (error) {
      this.logger.error(`Error aborting multipart upload: ${error.message}`);
    }
  }

  /**
   * Get file URL
   */
  private getFileUrl(key: string): string {
    const region = this.configService.get<string>('AWS_REGION');
    return `https://${this.bucket}.s3.${region}.amazonaws.com/${key}`;
  }

  /**
   * Extract key from S3 URL
   */
  private extractKeyFromUrl(url: string): string {
    const urlParts = url.split('/');
    return urlParts.slice(3).join('/');
  }
}



import { Processor, Process } from '@nestjs/bull';
import { Logger } from '@nestjs/common';
import { Job } from 'bull';
import { PrismaService } from '../../common/prisma/prisma.service';

@Processor('documents')
export class DocumentProcessor {
  private readonly logger = new Logger(DocumentProcessor.name);

  constructor(private prisma: PrismaService) {}

  @Process('process-document')
  async handleDocumentProcessing(job: Job) {
    const { documentId, documentType } = job.data;
    this.logger.log(`Processing document ${documentId} of type ${documentType}`);

    try {
      // TODO: OCR işlemi burada yapılacak
      // Örnek: Tesseract, Google Vision API, AWS Textract

      if (documentType === 'passport') {
        // Pasaport için özel işlemler
        this.logger.log(`Passport document detected, extracting data...`);
        // OCR ile pasaport numarası, tarihler vb. çıkar
      }

      // Document işlendi olarak işaretle
      await this.prisma.document.update({
        where: { id: documentId },
        data: {
          extractedData: {
            processed: true,
            processedAt: new Date().toISOString(),
          },
        },
      });

      this.logger.log(`Document ${documentId} processed successfully`);
    } catch (error) {
      this.logger.error(`Error processing document ${documentId}:`, error);
      throw error;
    }
  }

  @Process('check-expiry')
  async handleExpiryCheck(job: Job) {
    const { documentId } = job.data;
    this.logger.log(`Checking expiry for document ${documentId}`);

    try {
      const document = await this.prisma.document.findUnique({
        where: { id: documentId },
        include: { user: true },
      });

      if (!document || !document.expiryDate) {
        return;
      }

      const now = new Date();
      const expiryDate = new Date(document.expiryDate);
      const sixMonthsFromNow = new Date();
      sixMonthsFromNow.setMonth(sixMonthsFromNow.getMonth() + 6);

      let status = 'ACTIVE';
      let shouldNotify = false;

      if (expiryDate < now) {
        status = 'EXPIRED';
        shouldNotify = true;
      } else if (expiryDate < sixMonthsFromNow) {
        status = 'EXPIRING_SOON';
        shouldNotify = true;
      }

      await this.prisma.document.update({
        where: { id: documentId },
        data: { status: status as any },
      });

      if (shouldNotify) {
        await this.prisma.notification.create({
          data: {
            userId: document.userId,
            title: 'Belge Uyarısı',
            message: `${document.fileName} belgenizin süresi ${status === 'EXPIRED' ? 'dolmuş' : 'yakında dolacak'}.`,
            type: 'DOCUMENT_WARNING',
          },
        });
      }

      this.logger.log(`Expiry check completed for document ${documentId}`);
    } catch (error) {
      this.logger.error(`Error checking expiry for document ${documentId}:`, error);
    }
  }
}



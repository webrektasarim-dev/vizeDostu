import { Module } from '@nestjs/common';
import { BullModule } from '@nestjs/bull';
import { DocumentsService } from './documents.service';
import { DocumentsController } from './documents.controller';
import { DocumentProcessor } from './document.processor';

@Module({
  imports: [
    BullModule.registerQueue({
      name: 'documents',
    }),
  ],
  providers: [DocumentsService, DocumentProcessor],
  controllers: [DocumentsController],
  exports: [DocumentsService],
})
export class DocumentsModule {}



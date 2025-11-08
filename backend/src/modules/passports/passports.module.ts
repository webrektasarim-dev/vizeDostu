import { Module } from '@nestjs/common';
import { PassportsService } from './passports.service';
import { PassportsController } from './passports.controller';

@Module({
  providers: [PassportsService],
  controllers: [PassportsController],
  exports: [PassportsService],
})
export class PassportsModule {}



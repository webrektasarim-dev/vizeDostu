import { Module } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';
import { ThrottlerModule } from '@nestjs/throttler';
import { BullModule } from '@nestjs/bull';
import { ScheduleModule } from '@nestjs/schedule';

// Modules
import { PrismaModule } from './common/prisma/prisma.module';
import { AuthModule } from './modules/auth/auth.module';
import { UsersModule } from './modules/users/users.module';
import { DocumentsModule } from './modules/documents/documents.module';
import { ApplicationsModule } from './modules/applications/applications.module';
import { AppointmentsModule } from './modules/appointments/appointments.module';
import { NotificationsModule } from './modules/notifications/notifications.module';
import { AiAssistantModule } from './modules/ai-assistant/ai-assistant.module';
import { PassportsModule } from './modules/passports/passports.module';
import { AdminModule } from './modules/admin/admin.module';
import { S3Module } from './common/s3/s3.module';

@Module({
  imports: [
    // Configuration
    ConfigModule.forRoot({
      isGlobal: true,
      envFilePath: '.env',
    }),

    // Rate limiting
    ThrottlerModule.forRoot([
      {
        ttl: 60000, // 1 minute
        limit: 100, // 100 requests per minute
      },
    ]),

    // Bull Queue (Redis)
    BullModule.forRootAsync({
      useFactory: () => ({
        redis: {
          host: process.env.REDIS_HOST || 'localhost',
          port: parseInt(process.env.REDIS_PORT || '6379'),
        },
      }),
    }),

    // Schedule (Cron jobs)
    ScheduleModule.forRoot(),

    // Common modules
    PrismaModule,
    S3Module,

    // Feature modules
    AuthModule,
    UsersModule,
    DocumentsModule,
    ApplicationsModule,
    AppointmentsModule,
    NotificationsModule,
    AiAssistantModule,
    PassportsModule,
    AdminModule,
  ],
})
export class AppModule {}





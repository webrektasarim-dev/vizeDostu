import { Injectable, NotFoundException } from '@nestjs/common';
import { PrismaService } from '../../common/prisma/prisma.service';
import { CreateApplicationDto } from './dto/create-application.dto';
import { UpdateApplicationDto } from './dto/update-application.dto';

@Injectable()
export class ApplicationsService {
  constructor(private prisma: PrismaService) {}

  async create(userId: string, createDto: CreateApplicationDto) {
    const application = await this.prisma.application.create({
      data: {
        userId,
        country: createDto.country,
        visaType: createDto.visaType,
        status: 'PREPARING_DOCUMENTS',
        progressPercentage: 0,
      },
    });

    await this.prisma.notification.create({
      data: {
        userId,
        title: 'Yeni Başvuru',
        message: `${createDto.country} için ${createDto.visaType} vize başvurunuz oluşturuldu.`,
        type: 'APPLICATION_UPDATE',
      },
    });

    return application;
  }

  async findAll(userId: string) {
    return this.prisma.application.findMany({
      where: { userId },
      orderBy: { createdAt: 'desc' },
      include: {
        appointments: {
          orderBy: { appointmentDate: 'asc' },
        },
      },
    });
  }

  async findOne(userId: string, id: string) {
    const application = await this.prisma.application.findFirst({
      where: { id, userId },
      include: {
        appointments: true,
      },
    });

    if (!application) {
      throw new NotFoundException('Başvuru bulunamadı');
    }

    return application;
  }

  async update(userId: string, id: string, updateDto: UpdateApplicationDto) {
    const application = await this.prisma.application.findFirst({
      where: { id, userId },
    });

    if (!application) {
      throw new NotFoundException('Başvuru bulunamadı');
    }

    const updated = await this.prisma.application.update({
      where: { id },
      data: {
        ...updateDto,
        status: updateDto.status as any,
      },
    });

    if (updateDto.status && updateDto.status !== application.status) {
      await this.prisma.notification.create({
        data: {
          userId,
          title: 'Başvuru Güncellemesi',
          message: `${application.country} başvurunuzun durumu güncellendi: ${this.getStatusText(updateDto.status)}`,
          type: 'APPLICATION_UPDATE',
        },
      });
    }

    return updated;
  }

  async delete(userId: string, id: string) {
    const application = await this.prisma.application.findFirst({
      where: { id, userId },
    });

    if (!application) {
      throw new NotFoundException('Başvuru bulunamadı');
    }

    await this.prisma.application.delete({
      where: { id },
    });

    return { deleted: true };
  }

  async getActiveApplications(userId: string) {
    return this.prisma.application.findMany({
      where: {
        userId,
        status: {
          in: [
            'PREPARING_DOCUMENTS' as any,
            'APPOINTMENT_TAKEN' as any,
            'AT_CONSULATE' as any,
          ],
        },
      },
      orderBy: { createdAt: 'desc' },
    });
  }

  private getStatusText(status: string): string {
    const statusMap: Record<string, string> = {
      PREPARING_DOCUMENTS: 'Evrak Hazırlanıyor',
      APPOINTMENT_TAKEN: 'Randevu Alındı',
      AT_CONSULATE: 'Konsoloslukta',
      COMPLETED: 'Tamamlandı',
      REJECTED: 'Reddedildi',
      CANCELLED: 'İptal Edildi',
    };
    return statusMap[status] || status;
  }
}



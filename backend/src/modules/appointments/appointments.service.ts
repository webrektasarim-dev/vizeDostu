import { Injectable, NotFoundException } from '@nestjs/common';
import { PrismaService } from '../../common/prisma/prisma.service';
import { CreateAppointmentDto } from './dto/create-appointment.dto';

@Injectable()
export class AppointmentsService {
  constructor(private prisma: PrismaService) {}

  async create(userId: string, createDto: CreateAppointmentDto) {
    const appointment = await this.prisma.appointment.create({
      data: {
        userId,
        applicationId: createDto.applicationId,
        appointmentType: createDto.appointmentType,
        appointmentDate: new Date(createDto.appointmentDate),
        location: createDto.location,
        notes: createDto.notes,
      },
    });

    await this.prisma.notification.create({
      data: {
        userId,
        title: 'Yeni Randevu',
        message: `${this.getAppointmentTypeText(createDto.appointmentType)} randevunuz ${new Date(createDto.appointmentDate).toLocaleDateString('tr-TR')} tarihinde oluşturuldu.`,
        type: 'APPOINTMENT_REMINDER',
      },
    });

    return appointment;
  }

  async findAll(userId: string) {
    return this.prisma.appointment.findMany({
      where: { userId },
      orderBy: { appointmentDate: 'asc' },
      include: { application: true },
    });
  }

  async findUpcoming(userId: string) {
    return this.prisma.appointment.findMany({
      where: {
        userId,
        appointmentDate: {
          gte: new Date(),
        },
        status: {
          in: ['PENDING', 'CONFIRMED'],
        },
      },
      orderBy: { appointmentDate: 'asc' },
      include: { application: true },
    });
  }

  async findOne(userId: string, id: string) {
    const appointment = await this.prisma.appointment.findFirst({
      where: { id, userId },
      include: { application: true },
    });

    if (!appointment) {
      throw new NotFoundException('Randevu bulunamadı');
    }

    return appointment;
  }

  async update(userId: string, id: string, updateData: any) {
    const appointment = await this.prisma.appointment.findFirst({
      where: { id, userId },
    });

    if (!appointment) {
      throw new NotFoundException('Randevu bulunamadı');
    }

    return this.prisma.appointment.update({
      where: { id },
      data: updateData,
    });
  }

  async delete(userId: string, id: string) {
    const appointment = await this.prisma.appointment.findFirst({
      where: { id, userId },
    });

    if (!appointment) {
      throw new NotFoundException('Randevu bulunamadı');
    }

    await this.prisma.appointment.delete({
      where: { id },
    });

    return { deleted: true };
  }

  private getAppointmentTypeText(type: string): string {
    const typeMap: Record<string, string> = {
      VISA: 'Vize',
      PASSPORT: 'Pasaport',
      BIOMETRIC: 'Biyometrik',
      INTERVIEW: 'Mülakat',
    };
    return typeMap[type] || type;
  }
}



import { Injectable, NotFoundException } from '@nestjs/common';
import { PrismaService } from '../../common/prisma/prisma.service';
import { CreatePassportDto } from './dto/create-passport.dto';

@Injectable()
export class PassportsService {
  constructor(private prisma: PrismaService) {}

  async create(userId: string, createDto: CreatePassportDto) {
    return this.prisma.passport.create({
      data: {
        userId,
        passportNumber: createDto.passportNumber,
        issueDate: new Date(createDto.issueDate),
        expiryDate: new Date(createDto.expiryDate),
        issuingCountry: createDto.issuingCountry,
        documentId: createDto.documentId,
      },
    });
  }

  async findAll(userId: string) {
    const passports = await this.prisma.passport.findMany({
      where: { userId },
      include: { document: true },
      orderBy: { createdAt: 'desc' },
    });

    return passports.map((passport) => this.checkExpiryStatus(passport));
  }

  async findOne(userId: string, id: string) {
    const passport = await this.prisma.passport.findFirst({
      where: { id, userId },
      include: { document: true },
    });

    if (!passport) {
      throw new NotFoundException('Pasaport bulunamadı');
    }

    return this.checkExpiryStatus(passport);
  }

  async delete(userId: string, id: string) {
    const passport = await this.prisma.passport.findFirst({
      where: { id, userId },
    });

    if (!passport) {
      throw new NotFoundException('Pasaport bulunamadı');
    }

    await this.prisma.passport.delete({
      where: { id },
    });

    return { deleted: true };
  }

  async checkExpiringSoon() {
    const sixMonthsFromNow = new Date();
    sixMonthsFromNow.setMonth(sixMonthsFromNow.getMonth() + 6);

    const expiringPassports = await this.prisma.passport.findMany({
      where: {
        expiryDate: {
          lte: sixMonthsFromNow,
          gte: new Date(),
        },
      },
      include: { user: true },
    });

    for (const passport of expiringPassports) {
      const existing = await this.prisma.notification.findFirst({
        where: {
          userId: passport.userId,
          type: 'DOCUMENT_WARNING',
          message: {
            contains: passport.passportNumber,
          },
          createdAt: {
            gte: new Date(Date.now() - 7 * 24 * 60 * 60 * 1000), // Son 7 gün
          },
        },
      });

      if (!existing) {
        await this.prisma.notification.create({
          data: {
            userId: passport.userId,
            title: 'Pasaport Uyarısı',
            message: `${passport.passportNumber} numaralı pasaportunuzun geçerlilik süresi 6 ay içinde dolacak.`,
            type: 'DOCUMENT_WARNING',
          },
        });
      }
    }

    return { checked: expiringPassports.length };
  }

  private checkExpiryStatus(passport: any) {
    const now = new Date();
    const expiryDate = new Date(passport.expiryDate);
    const sixMonthsFromNow = new Date();
    sixMonthsFromNow.setMonth(sixMonthsFromNow.getMonth() + 6);

    let status = 'valid';
    let warning = null;

    if (expiryDate < now) {
      status = 'expired';
      warning = 'Pasaportunuzun süresi dolmuş';
    } else if (expiryDate < sixMonthsFromNow) {
      status = 'expiring_soon';
      warning = 'Geçerlilik süresi 6 ay içinde doluyor';
    }

    return {
      ...passport,
      status,
      warning,
    };
  }
}



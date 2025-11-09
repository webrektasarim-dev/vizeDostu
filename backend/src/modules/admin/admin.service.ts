import { Injectable, NotFoundException } from '@nestjs/common';
import { PrismaService } from '../../common/prisma/prisma.service';
import { ApplicationStatus, UserRole } from '@prisma/client';

@Injectable()
export class AdminService {
  constructor(private prisma: PrismaService) {}

  // === DASHBOARD STATS ===
  async getDashboardStats() {
    console.log('📊 Fetching admin dashboard stats...');
    
    const [
      totalUsers,
      totalApplications,
      totalDocuments,
      activeApplications,
      completedApplications,
      todayRegistrations,
    ] = await Promise.all([
      this.prisma.user.count(),
      this.prisma.application.count(),
      this.prisma.document.count(),
      this.prisma.application.count({
        where: {
          status: {
            in: [
              ApplicationStatus.PREPARING_DOCUMENTS,
              ApplicationStatus.APPOINTMENT_TAKEN,
              ApplicationStatus.AT_CONSULATE,
            ],
          },
        },
      }),
      this.prisma.application.count({
        where: { status: ApplicationStatus.COMPLETED },
      }),
      this.prisma.user.count({
        where: {
          createdAt: {
            gte: new Date(new Date().setHours(0, 0, 0, 0)),
          },
        },
      }),
    ]);

    const stats = {
      totalUsers,
      totalApplications,
      totalDocuments,
      activeApplications,
      completedApplications,
      todayRegistrations,
    };
    
    console.log('✅ Stats:', stats);
    return stats;
  }

  // === USER MANAGEMENT ===
  async getAllUsers(page: number = 1, limit: number = 20, search?: string) {
    const skip = (page - 1) * limit;

    const where = search
      ? {
          OR: [
            { email: { contains: search, mode: 'insensitive' as const } },
            { fullName: { contains: search, mode: 'insensitive' as const } },
          ],
        }
      : {};

    const [users, total] = await Promise.all([
      this.prisma.user.findMany({
        where,
        skip,
        take: limit,
        select: {
          id: true,
          email: true,
          fullName: true,
          role: true,
          isActive: true,
          isVerified: true,
          createdAt: true,
          _count: {
            select: {
              applications: true,
              documents: true,
            },
          },
        },
        orderBy: { createdAt: 'desc' },
      }),
      this.prisma.user.count({ where }),
    ]);

    return {
      users,
      pagination: {
        page,
        limit,
        total,
        totalPages: Math.ceil(total / limit),
      },
    };
  }

  async getUserById(id: string) {
    const user = await this.prisma.user.findUnique({
      where: { id },
      select: {
        id: true,
        email: true,
        fullName: true,
        phoneNumber: true,
        role: true,
        isActive: true,
        isVerified: true,
        createdAt: true,
        updatedAt: true,
        applications: {
          select: {
            id: true,
            country: true,
            visaType: true,
            status: true,
            createdAt: true,
          },
          orderBy: { createdAt: 'desc' },
        },
        documents: {
          select: {
            id: true,
            documentType: true,
            fileName: true,
            fileSize: true,
            uploadedAt: true,
          },
          orderBy: { uploadedAt: 'desc' },
        },
        _count: {
          select: {
            applications: true,
            documents: true,
            appointments: true,
            chatHistory: true,
          },
        },
      },
    });

    if (!user) {
      throw new NotFoundException('User not found');
    }

    return user;
  }

  async updateUserStatus(id: string, isActive: boolean) {
    const user = await this.prisma.user.update({
      where: { id },
      data: { isActive },
      select: {
        id: true,
        email: true,
        fullName: true,
        isActive: true,
      },
    });

    return { message: 'User status updated', user };
  }

  async updateUserRole(id: string, role: UserRole) {
    const user = await this.prisma.user.update({
      where: { id },
      data: { role },
      select: {
        id: true,
        email: true,
        fullName: true,
        role: true,
      },
    });

    return { message: 'User role updated', user };
  }

  async deleteUser(id: string) {
    await this.prisma.user.delete({
      where: { id },
    });

    return { message: 'User deleted successfully' };
  }

  // === APPLICATION MANAGEMENT ===
  async getAllApplications(page: number = 1, limit: number = 20, status?: string) {
    console.log(`📋 Fetching applications (page: ${page}, limit: ${limit}, status: ${status || 'all'})`);
    
    const skip = (page - 1) * limit;

    const where = status ? { status: status as ApplicationStatus } : {};

    const [applications, total] = await Promise.all([
      this.prisma.application.findMany({
        where,
        skip,
        take: limit,
        include: {
          user: {
            select: {
              id: true,
              fullName: true,
              email: true,
            },
          },
        },
        orderBy: { createdAt: 'desc' },
      }),
      this.prisma.application.count({ where }),
    ]);

    console.log(`✅ Found ${applications.length} applications (total: ${total})`);
    
    return {
      applications,
      pagination: {
        page,
        limit,
        total,
        totalPages: Math.ceil(total / limit),
      },
    };
  }

  async getApplicationById(id: string) {
    const application = await this.prisma.application.findUnique({
      where: { id },
      include: {
        user: {
          select: {
            id: true,
            fullName: true,
            email: true,
            phoneNumber: true,
          },
        },
        appointments: true,
      },
    });

    if (!application) {
      throw new NotFoundException('Application not found');
    }

    return application;
  }

  async updateApplicationStatus(id: string, status: string) {
    const application = await this.prisma.application.update({
      where: { id },
      data: { status: status as ApplicationStatus },
      include: {
        user: {
          select: {
            id: true,
            fullName: true,
            email: true,
          },
        },
      },
    });

    return { message: 'Application status updated', application };
  }

  async deleteApplication(id: string) {
    await this.prisma.application.delete({
      where: { id },
    });

    return { message: 'Application deleted successfully' };
  }

  // === DOCUMENT MANAGEMENT ===
  async getAllDocuments(page: number = 1, limit: number = 20) {
    console.log(`📁 Fetching documents (page: ${page}, limit: ${limit})`);
    
    const skip = (page - 1) * limit;

    const [documents, total] = await Promise.all([
      this.prisma.document.findMany({
        skip,
        take: limit,
        include: {
          user: {
            select: {
              id: true,
              fullName: true,
              email: true,
            },
          },
        },
        orderBy: { uploadedAt: 'desc' },
      }),
      this.prisma.document.count(),
    ]);

    console.log(`✅ Found ${documents.length} documents (total: ${total})`);
    
    return {
      documents,
      pagination: {
        page,
        limit,
        total,
        totalPages: Math.ceil(total / limit),
      },
    };
  }

  async getDocumentById(id: string) {
    const document = await this.prisma.document.findUnique({
      where: { id },
      include: {
        user: {
          select: {
            id: true,
            fullName: true,
            email: true,
          },
        },
      },
    });

    if (!document) {
      throw new NotFoundException('Document not found');
    }

    return document;
  }

  async deleteDocument(id: string) {
    await this.prisma.document.delete({
      where: { id },
    });

    return { message: 'Document deleted successfully' };
  }

  // === CHAT LOGS ===
  async getChatLogs(page: number = 1, limit: number = 50, userId?: string) {
    const skip = (page - 1) * limit;

    const where = userId ? { userId } : {};

    const [logs, total] = await Promise.all([
      this.prisma.chatMessage.findMany({
        where,
        skip,
        take: limit,
        include: {
          user: {
            select: {
              id: true,
              fullName: true,
              email: true,
            },
          },
        },
        orderBy: { createdAt: 'desc' },
      }),
      this.prisma.chatMessage.count({ where }),
    ]);

    return {
      logs,
      pagination: {
        page,
        limit,
        total,
        totalPages: Math.ceil(total / limit),
      },
    };
  }
}


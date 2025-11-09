import { Controller, Get, Put, Delete, Param, Body, UseGuards, Query } from '@nestjs/common';
import { ApiTags, ApiOperation, ApiBearerAuth } from '@nestjs/swagger';
import { JwtAuthGuard } from '../../common/guards/jwt-auth.guard';
import { RolesGuard } from '../../common/guards/roles.guard';
import { Roles } from '../../common/decorators/roles.decorator';
import { UserRole } from '@prisma/client';
import { AdminService } from './admin.service';

@ApiTags('Admin')
@ApiBearerAuth()
@Controller('admin')
@UseGuards(JwtAuthGuard, RolesGuard)
@Roles(UserRole.ADMIN)
export class AdminController {
  constructor(private readonly adminService: AdminService) {}

  // === DASHBOARD STATS ===
  @Get('stats')
  @ApiOperation({ summary: 'Get admin dashboard statistics' })
  async getDashboardStats() {
    return this.adminService.getDashboardStats();
  }

  // === USER MANAGEMENT ===
  @Get('users')
  @ApiOperation({ summary: 'Get all users (admin only)' })
  async getAllUsers(
    @Query('page') page: string = '1',
    @Query('limit') limit: string = '20',
    @Query('search') search?: string,
  ) {
    return this.adminService.getAllUsers(
      parseInt(page),
      parseInt(limit),
      search,
    );
  }

  @Get('users/:id')
  @ApiOperation({ summary: 'Get user details by ID' })
  async getUserById(@Param('id') id: string) {
    return this.adminService.getUserById(id);
  }

  @Put('users/:id/status')
  @ApiOperation({ summary: 'Update user active status' })
  async updateUserStatus(
    @Param('id') id: string,
    @Body('isActive') isActive: boolean,
  ) {
    return this.adminService.updateUserStatus(id, isActive);
  }

  @Put('users/:id/role')
  @ApiOperation({ summary: 'Update user role' })
  async updateUserRole(
    @Param('id') id: string,
    @Body('role') role: UserRole,
  ) {
    return this.adminService.updateUserRole(id, role);
  }

  @Delete('users/:id')
  @ApiOperation({ summary: 'Delete user (soft delete)' })
  async deleteUser(@Param('id') id: string) {
    return this.adminService.deleteUser(id);
  }

  // === APPLICATION MANAGEMENT ===
  @Get('applications')
  @ApiOperation({ summary: 'Get all applications' })
  async getAllApplications(
    @Query('page') page: string = '1',
    @Query('limit') limit: string = '20',
    @Query('status') status?: string,
  ) {
    return this.adminService.getAllApplications(
      parseInt(page),
      parseInt(limit),
      status,
    );
  }

  @Get('applications/:id')
  @ApiOperation({ summary: 'Get application details' })
  async getApplicationById(@Param('id') id: string) {
    return this.adminService.getApplicationById(id);
  }

  @Put('applications/:id/status')
  @ApiOperation({ summary: 'Update application status' })
  async updateApplicationStatus(
    @Param('id') id: string,
    @Body('status') status: string,
  ) {
    return this.adminService.updateApplicationStatus(id, status);
  }

  @Delete('applications/:id')
  @ApiOperation({ summary: 'Delete application (admin)' })
  async deleteApplication(@Param('id') id: string) {
    return this.adminService.deleteApplication(id);
  }

  // === DOCUMENT MANAGEMENT ===
  @Get('documents')
  @ApiOperation({ summary: 'Get all documents' })
  async getAllDocuments(
    @Query('page') page: string = '1',
    @Query('limit') limit: string = '20',
  ) {
    return this.adminService.getAllDocuments(
      parseInt(page),
      parseInt(limit),
    );
  }

  @Get('documents/:id')
  @ApiOperation({ summary: 'Get document details' })
  async getDocumentById(@Param('id') id: string) {
    return this.adminService.getDocumentById(id);
  }

  @Delete('documents/:id')
  @ApiOperation({ summary: 'Delete document' })
  async deleteDocument(@Param('id') id: string) {
    return this.adminService.deleteDocument(id);
  }

  // === CHAT LOGS ===
  @Get('chat-logs')
  @ApiOperation({ summary: 'Get all chat logs' })
  async getChatLogs(
    @Query('page') page: string = '1',
    @Query('limit') limit: string = '50',
    @Query('userId') userId?: string,
  ) {
    return this.adminService.getChatLogs(
      parseInt(page),
      parseInt(limit),
      userId,
    );
  }
}


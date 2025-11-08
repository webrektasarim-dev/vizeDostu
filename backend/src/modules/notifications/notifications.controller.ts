import { Controller, Get, Put, Delete, Param, UseGuards } from '@nestjs/common';
import { ApiTags, ApiOperation, ApiBearerAuth } from '@nestjs/swagger';
import { JwtAuthGuard } from '../../common/guards/jwt-auth.guard';
import { CurrentUser } from '../../common/decorators/current-user.decorator';
import { NotificationsService } from './notifications.service';

@ApiTags('notifications')
@ApiBearerAuth()
@UseGuards(JwtAuthGuard)
@Controller('notifications')
export class NotificationsController {
  constructor(private notificationsService: NotificationsService) {}

  @Get()
  @ApiOperation({ summary: 'Tüm bildirimleri listele' })
  async findAll(@CurrentUser() user: any) {
    return this.notificationsService.findAll(user.userId);
  }

  @Get('unread')
  @ApiOperation({ summary: 'Okunmamış bildirimleri listele' })
  async findUnread(@CurrentUser() user: any) {
    return this.notificationsService.findUnread(user.userId);
  }

  @Get('unread/count')
  @ApiOperation({ summary: 'Okunmamış bildirim sayısı' })
  async getUnreadCount(@CurrentUser() user: any) {
    return this.notificationsService.getUnreadCount(user.userId);
  }

  @Put(':id/read')
  @ApiOperation({ summary: 'Bildirimi okundu olarak işaretle' })
  async markAsRead(@CurrentUser() user: any, @Param('id') id: string) {
    return this.notificationsService.markAsRead(user.userId, id);
  }

  @Put('read-all')
  @ApiOperation({ summary: 'Tüm bildirimleri okundu olarak işaretle' })
  async markAllAsRead(@CurrentUser() user: any) {
    return this.notificationsService.markAllAsRead(user.userId);
  }

  @Delete(':id')
  @ApiOperation({ summary: 'Bildirim sil' })
  async delete(@CurrentUser() user: any, @Param('id') id: string) {
    return this.notificationsService.delete(user.userId, id);
  }
}



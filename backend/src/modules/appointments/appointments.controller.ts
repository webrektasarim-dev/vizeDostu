import { Controller, Get, Post, Put, Delete, Body, Param, UseGuards } from '@nestjs/common';
import { ApiTags, ApiOperation, ApiBearerAuth } from '@nestjs/swagger';
import { JwtAuthGuard } from '../../common/guards/jwt-auth.guard';
import { CurrentUser } from '../../common/decorators/current-user.decorator';
import { AppointmentsService } from './appointments.service';
import { CreateAppointmentDto } from './dto/create-appointment.dto';

@ApiTags('appointments')
@ApiBearerAuth()
@UseGuards(JwtAuthGuard)
@Controller('appointments')
export class AppointmentsController {
  constructor(private appointmentsService: AppointmentsService) {}

  @Post()
  @ApiOperation({ summary: 'Yeni randevu oluştur' })
  async create(@CurrentUser() user: any, @Body() createDto: CreateAppointmentDto) {
    return this.appointmentsService.create(user.userId, createDto);
  }

  @Get()
  @ApiOperation({ summary: 'Tüm randevuları listele' })
  async findAll(@CurrentUser() user: any) {
    return this.appointmentsService.findAll(user.userId);
  }

  @Get('upcoming')
  @ApiOperation({ summary: 'Yaklaşan randevuları listele' })
  async findUpcoming(@CurrentUser() user: any) {
    return this.appointmentsService.findUpcoming(user.userId);
  }

  @Get(':id')
  @ApiOperation({ summary: 'Randevu detayı' })
  async findOne(@CurrentUser() user: any, @Param('id') id: string) {
    return this.appointmentsService.findOne(user.userId, id);
  }

  @Delete(':id')
  @ApiOperation({ summary: 'Randevu sil' })
  async delete(@CurrentUser() user: any, @Param('id') id: string) {
    return this.appointmentsService.delete(user.userId, id);
  }
}



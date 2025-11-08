import { Controller, Get, Post, Put, Delete, Body, Param, UseGuards } from '@nestjs/common';
import { ApiTags, ApiOperation, ApiBearerAuth } from '@nestjs/swagger';
import { JwtAuthGuard } from '../../common/guards/jwt-auth.guard';
import { CurrentUser } from '../../common/decorators/current-user.decorator';
import { ApplicationsService } from './applications.service';
import { CreateApplicationDto } from './dto/create-application.dto';
import { UpdateApplicationDto } from './dto/update-application.dto';

@ApiTags('applications')
@ApiBearerAuth()
@UseGuards(JwtAuthGuard)
@Controller('applications')
export class ApplicationsController {
  constructor(private applicationsService: ApplicationsService) {}

  @Post()
  @ApiOperation({ summary: 'Yeni başvuru oluştur' })
  async create(@CurrentUser() user: any, @Body() createDto: CreateApplicationDto) {
    return this.applicationsService.create(user.userId, createDto);
  }

  @Get()
  @ApiOperation({ summary: 'Tüm başvuruları listele' })
  async findAll(@CurrentUser() user: any) {
    return this.applicationsService.findAll(user.userId);
  }

  @Get('active')
  @ApiOperation({ summary: 'Aktif başvuruları listele' })
  async getActive(@CurrentUser() user: any) {
    return this.applicationsService.getActiveApplications(user.userId);
  }

  @Get(':id')
  @ApiOperation({ summary: 'Başvuru detayı' })
  async findOne(@CurrentUser() user: any, @Param('id') id: string) {
    return this.applicationsService.findOne(user.userId, id);
  }

  @Put(':id')
  @ApiOperation({ summary: 'Başvuru güncelle' })
  async update(
    @CurrentUser() user: any,
    @Param('id') id: string,
    @Body() updateDto: UpdateApplicationDto,
  ) {
    return this.applicationsService.update(user.userId, id, updateDto);
  }

  @Delete(':id')
  @ApiOperation({ summary: 'Başvuru sil' })
  async delete(@CurrentUser() user: any, @Param('id') id: string) {
    return this.applicationsService.delete(user.userId, id);
  }
}



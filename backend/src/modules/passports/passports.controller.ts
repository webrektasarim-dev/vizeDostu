import { Controller, Get, Post, Delete, Body, Param, UseGuards } from '@nestjs/common';
import { ApiTags, ApiOperation, ApiBearerAuth } from '@nestjs/swagger';
import { JwtAuthGuard } from '../../common/guards/jwt-auth.guard';
import { CurrentUser } from '../../common/decorators/current-user.decorator';
import { PassportsService } from './passports.service';
import { CreatePassportDto } from './dto/create-passport.dto';

@ApiTags('passports')
@ApiBearerAuth()
@UseGuards(JwtAuthGuard)
@Controller('passports')
export class PassportsController {
  constructor(private passportsService: PassportsService) {}

  @Post()
  @ApiOperation({ summary: 'Yeni pasaport ekle' })
  async create(@CurrentUser() user: any, @Body() createDto: CreatePassportDto) {
    return this.passportsService.create(user.userId, createDto);
  }

  @Get()
  @ApiOperation({ summary: 'Tüm pasaportları listele' })
  async findAll(@CurrentUser() user: any) {
    return this.passportsService.findAll(user.userId);
  }

  @Get(':id')
  @ApiOperation({ summary: 'Pasaport detayı' })
  async findOne(@CurrentUser() user: any, @Param('id') id: string) {
    return this.passportsService.findOne(user.userId, id);
  }

  @Delete(':id')
  @ApiOperation({ summary: 'Pasaport sil' })
  async delete(@CurrentUser() user: any, @Param('id') id: string) {
    return this.passportsService.delete(user.userId, id);
  }
}



import { Controller, Post, Get, Delete, Body, Query, UseGuards } from '@nestjs/common';
import { ApiTags, ApiOperation, ApiBearerAuth } from '@nestjs/swagger';
import { JwtAuthGuard } from '../../common/guards/jwt-auth.guard';
import { CurrentUser } from '../../common/decorators/current-user.decorator';
import { AiAssistantService } from './ai-assistant.service';
import { ChatDto } from './dto/chat.dto';

@ApiTags('ai-assistant')
@ApiBearerAuth()
@UseGuards(JwtAuthGuard)
@Controller('ai-assistant')
export class AiAssistantController {
  constructor(private aiAssistantService: AiAssistantService) {}

  @Post('chat')
  @ApiOperation({ summary: 'AI ile sohbet et' })
  async chat(@CurrentUser() user: any, @Body() chatDto: ChatDto) {
    return this.aiAssistantService.chat(user.userId, chatDto.message);
  }

  @Get('history')
  @ApiOperation({ summary: 'Sohbet geçmişini getir' })
  async getHistory(@CurrentUser() user: any, @Query('limit') limit?: string) {
    const limitNum = limit ? parseInt(limit) : 50;
    return this.aiAssistantService.getChatHistory(user.userId, limitNum);
  }

  @Delete('history')
  @ApiOperation({ summary: 'Sohbet geçmişini temizle' })
  async clearHistory(@CurrentUser() user: any) {
    return this.aiAssistantService.clearChatHistory(user.userId);
  }

  @Get('visa-requirements')
  @ApiOperation({ summary: 'Ülke bazlı vize gereksinimlerini getir' })
  async getVisaRequirements(@Query('country') country: string) {
    return this.aiAssistantService.getVisaRequirements(country);
  }
}



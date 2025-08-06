import { Controller, Get, Put, Body, UseGuards } from '@nestjs/common';
import { ConfigAppService } from './config.service';
import { UpdateConfigDto } from './dto/update-config.dto';
import { JwtAuthGuard } from '../auth/jwt-auth.guard';

@Controller('config')
export class ConfigAppController {
  constructor(private readonly configService: ConfigAppService) {}

  @Get()
  async getConfig() {
    return this.configService.getConfig();
  }

  @Put()
  @UseGuards(JwtAuthGuard)
  async updateConfig(@Body() updateConfigDto: UpdateConfigDto) {
    return this.configService.updateConfig(updateConfigDto);
  }
}

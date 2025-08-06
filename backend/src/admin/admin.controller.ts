import { Controller, Get, Post, Put, Param, Body, Query, UseGuards } from '@nestjs/common';
import { P2PService } from '../p2p/p2p.service';
import { ConfigAppService } from '../config/config.service';
import { UpdateConfigDto } from '../config/dto/update-config.dto';
import { JwtAuthGuard } from '../auth/jwt-auth.guard';

@Controller('admin')
@UseGuards(JwtAuthGuard)
export class AdminController {
  constructor(
    private readonly p2pService: P2PService,
    private readonly configService: ConfigAppService,
  ) {}

  // P2P Order Management
  @Get('p2p/orders')
  async getAllOrders(
    @Query('page') page: string = '1',
    @Query('limit') limit: string = '20',
  ) {
    const pageNum = parseInt(page, 10) || 1;
    const limitNum = parseInt(limit, 10) || 20;
    return this.p2pService.getAllOrders(pageNum, limitNum);
  }

  @Post('p2p/orders/:id/confirm')
  async confirmOrder(
    @Param('id') orderId: string,
    @Body('txHash') txHash?: string,
  ) {
    return this.p2pService.confirmOrder(orderId, txHash);
  }

  @Post('p2p/orders/:id/cancel')
  async cancelOrder(@Param('id') orderId: string) {
    return this.p2pService.cancelOrder(orderId);
  }

  // Config Management
  @Put('config')
  async updateConfig(@Body() updateConfigDto: UpdateConfigDto) {
    return this.configService.updateConfig(updateConfigDto);
  }
}

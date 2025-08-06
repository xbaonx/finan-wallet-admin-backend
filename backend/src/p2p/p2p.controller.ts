import { Controller, Post, Get, Body, Param, Query } from '@nestjs/common';
import { P2PService } from './p2p.service';
import { CreateP2POrderDto } from './dto/create-p2p-order.dto';

@Controller('p2p')
export class P2PController {
  constructor(private readonly p2pService: P2PService) {}

  @Post('buy')
  async createBuyOrder(@Body() createOrderDto: CreateP2POrderDto) {
    return this.p2pService.createBuyOrder(createOrderDto);
  }

  @Post('confirm-payment')
  async confirmPayment(@Body('orderId') orderId: string) {
    return this.p2pService.confirmPayment(orderId);
  }

  @Get('status/:orderId')
  async getOrderStatus(@Param('orderId') orderId: string) {
    return this.p2pService.getOrderStatus(orderId);
  }
}

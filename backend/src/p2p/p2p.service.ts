import { Injectable, NotFoundException, BadRequestException } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';
import { ConfigAppService } from '../config/config.service';
import { CreateP2POrderDto } from './dto/create-p2p-order.dto';
import { P2PStatus } from '@prisma/client';

@Injectable()
export class P2PService {
  constructor(
    private prisma: PrismaService,
    private configService: ConfigAppService,
  ) {}

  async createBuyOrder(createOrderDto: CreateP2POrderDto) {
    const { amount, walletAddress } = createOrderDto;

    // Validate amount
    if (amount <= 0) {
      throw new BadRequestException('Amount must be greater than 0');
    }

    // Get current config for payment info
    const config = await this.configService.getConfig();
    if (!config) {
      throw new BadRequestException('Payment configuration not found');
    }

    // Create order
    const order = await this.prisma.p2POrder.create({
      data: {
        walletAddress,
        amount,
        status: P2PStatus.PENDING,
      },
    });

    // Return order with payment info
    return {
      orderId: order.id,
      amount: order.amount,
      status: order.status,
      walletAddress: order.walletAddress,
      paymentInfo: {
        bankName: config.bankName,
        accountNumber: config.accountNumber,
        accountHolder: config.accountHolder,
        qrImageUrl: config.qrImageUrl,
        note: `P2P Order #${order.id} - ${amount} USDT`,
      },
      createdAt: order.createdAt,
    };
  }

  async confirmPayment(orderId: string) {
    const order = await this.prisma.p2POrder.findUnique({
      where: { id: orderId },
    });

    if (!order) {
      throw new NotFoundException('Order not found');
    }

    if (order.status !== P2PStatus.PENDING) {
      throw new BadRequestException('Order is not in pending status');
    }

    const updatedOrder = await this.prisma.p2POrder.update({
      where: { id: orderId },
      data: {
        status: P2PStatus.PAID,
        updatedAt: new Date(),
      },
    });

    return {
      orderId: updatedOrder.id,
      status: updatedOrder.status,
      message: 'Payment confirmation received. Waiting for admin approval.',
    };
  }

  async getOrderStatus(orderId: string) {
    const order = await this.prisma.p2POrder.findUnique({
      where: { id: orderId },
    });

    if (!order) {
      throw new NotFoundException('Order not found');
    }

    return {
      orderId: order.id,
      status: order.status,
      amount: order.amount,
      walletAddress: order.walletAddress,
      txHash: order.txHash,
      createdAt: order.createdAt,
      updatedAt: order.updatedAt,
    };
  }

  async getAllOrders(page: number = 1, limit: number = 20) {
    const skip = (page - 1) * limit;

    const [orders, total] = await Promise.all([
      this.prisma.p2POrder.findMany({
        skip,
        take: limit,
        orderBy: { createdAt: 'desc' },
      }),
      this.prisma.p2POrder.count(),
    ]);

    return {
      orders,
      pagination: {
        page,
        limit,
        total,
        totalPages: Math.ceil(total / limit),
      },
    };
  }

  async confirmOrder(orderId: string, txHash?: string) {
    const order = await this.prisma.p2POrder.findUnique({
      where: { id: orderId },
    });

    if (!order) {
      throw new NotFoundException('Order not found');
    }

    if (order.status !== P2PStatus.PAID) {
      throw new BadRequestException('Order must be in PAID status to confirm');
    }

    const updatedOrder = await this.prisma.p2POrder.update({
      where: { id: orderId },
      data: {
        status: P2PStatus.CONFIRMED,
        txHash: txHash || null,
        updatedAt: new Date(),
      },
    });

    return {
      orderId: updatedOrder.id,
      status: updatedOrder.status,
      txHash: updatedOrder.txHash,
      message: 'Order confirmed successfully',
    };
  }

  async cancelOrder(orderId: string) {
    const order = await this.prisma.p2POrder.findUnique({
      where: { id: orderId },
    });

    if (!order) {
      throw new NotFoundException('Order not found');
    }

    if (order.status === P2PStatus.CONFIRMED) {
      throw new BadRequestException('Cannot cancel confirmed order');
    }

    const updatedOrder = await this.prisma.p2POrder.update({
      where: { id: orderId },
      data: {
        status: P2PStatus.CANCELLED,
        updatedAt: new Date(),
      },
    });

    return {
      orderId: updatedOrder.id,
      status: updatedOrder.status,
      message: 'Order cancelled successfully',
    };
  }

  async getOrdersByStatus(status: P2PStatus) {
    return this.prisma.p2POrder.findMany({
      where: { status },
      orderBy: { createdAt: 'desc' },
    });
  }
}

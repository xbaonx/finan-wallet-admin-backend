import { Injectable, NotFoundException } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';
import { UpdateConfigDto } from './dto/update-config.dto';

@Injectable()
export class ConfigAppService {
  constructor(private prisma: PrismaService) {}

  async getConfig() {
    const config = await this.prisma.config.findFirst({
      where: { isActive: true },
    });

    if (!config) {
      // Return default config if none exists
      return {
        bankName: '',
        accountNumber: '',
        accountHolder: '',
        qrImageUrl: '',
        note: '',
        adminWalletAddress: '',
        usdtRate: 1.0,
      };
    }

    return {
      id: config.id,
      bankName: config.bankName,
      accountNumber: config.accountNumber,
      accountHolder: config.accountHolder,
      qrImageUrl: config.qrImageUrl,
      note: config.note,
      adminWalletAddress: config.adminWalletAddress,
      usdtRate: config.usdtRate,
      updatedAt: config.updatedAt,
    };
  }

  async updateConfig(updateConfigDto: UpdateConfigDto) {
    // Deactivate all existing configs
    await this.prisma.config.updateMany({
      where: { isActive: true },
      data: { isActive: false },
    });

    // Create new active config
    const config = await this.prisma.config.create({
      data: {
        ...updateConfigDto,
        isActive: true,
      },
    });

    return {
      id: config.id,
      bankName: config.bankName,
      accountNumber: config.accountNumber,
      accountHolder: config.accountHolder,
      qrImageUrl: config.qrImageUrl,
      note: config.note,
      adminWalletAddress: config.adminWalletAddress,
      usdtRate: config.usdtRate,
      updatedAt: config.updatedAt,
    };
  }

  async initializeDefaultConfig() {
    const existingConfig = await this.prisma.config.findFirst();
    
    if (!existingConfig) {
      return this.prisma.config.create({
        data: {
          bankName: 'Default Bank',
          accountNumber: '1234567890',
          accountHolder: 'Finan Wallet Admin',
          qrImageUrl: '',
          note: 'Please transfer to the account above and confirm payment',
          adminWalletAddress: '0x0000000000000000000000000000000000000000',
          usdtRate: 1.0,
          isActive: true,
        },
      });
    }

    return existingConfig;
  }
}

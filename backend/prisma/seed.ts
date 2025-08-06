import { PrismaClient } from '@prisma/client';
import * as bcrypt from 'bcryptjs';

const prisma = new PrismaClient();

async function main() {
  console.log('🌱 Bắt đầu seed database...');

  // Tạo admin user mặc định
  const adminPassword = 'admin123'; // Thay đổi trong production
  const hashedPassword = await bcrypt.hash(adminPassword, 10);

  const admin = await prisma.adminUser.upsert({
    where: { username: 'admin' },
    update: {},
    create: {
      username: 'admin',
      passwordHash: hashedPassword,
    },
  });

  console.log('✅ Tạo admin user:', admin.username);

  // Tạo cấu hình mặc định
  const config = await prisma.config.upsert({
    where: { id: 'default' },
    update: {},
    create: {
      id: 'default',
      bankName: 'Vietcombank',
      accountNumber: '1234567890',
      accountHolder: 'FINAN WALLET ADMIN',
      qrImageUrl: '',
      note: 'Vui lòng chuyển khoản theo thông tin trên và xác nhận thanh toán.',
      adminWalletAddress: '0x0000000000000000000000000000000000000000',
      usdtRate: 24000, // 1 USDT = 24,000 VND
      isActive: true,
    },
  });

  console.log('✅ Tạo cấu hình mặc định');

  // Thêm một số token phổ biến
  const popularTokens = [
    {
      symbol: 'BNB',
      name: 'BNB',
      address: '0xbb4CdB9CBd36B01bD1cBaEBF2De08d9173bc095c',
      decimals: 18,
      logoUri: 'https://tokens.1inch.io/0xbb4cdb9cbd36b01bd1cbaebf2de08d9173bc095c.png',
    },
    {
      symbol: 'USDT',
      name: 'Tether USD',
      address: '0x55d398326f99059fF775485246999027B3197955',
      decimals: 18,
      logoUri: 'https://tokens.1inch.io/0x55d398326f99059ff775485246999027b3197955.png',
    },
    {
      symbol: 'USDC',
      name: 'USD Coin',
      address: '0x8AC76a51cc950d9822D68b83fE1Ad97B32Cd580d',
      decimals: 18,
      logoUri: 'https://tokens.1inch.io/0x8ac76a51cc950d9822d68b83fe1ad97b32cd580d.png',
    },
    {
      symbol: 'BUSD',
      name: 'Binance USD',
      address: '0xe9e7CEA3DedcA5984780Bafc599bD69ADd087D56',
      decimals: 18,
      logoUri: 'https://tokens.1inch.io/0xe9e7cea3dedca5984780bafc599bd69add087d56.png',
    },
  ];

  for (const token of popularTokens) {
    await prisma.token.upsert({
      where: { address: token.address },
      update: token,
      create: token,
    });
  }

  console.log('✅ Thêm token phổ biến');

  console.log('🎉 Seed hoàn thành!');
  console.log('');
  console.log('📋 Thông tin đăng nhập admin:');
  console.log('   Username: admin');
  console.log('   Password: admin123');
  console.log('');
  console.log('⚠️  Nhớ thay đổi mật khẩu trong production!');
}

main()
  .catch((e) => {
    console.error('❌ Lỗi seed:', e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });

import { Module } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';
import { ScheduleModule } from '@nestjs/schedule';
import { PrismaModule } from './prisma/prisma.module';
import { AuthModule } from './auth/auth.module';
import { TokensModule } from './tokens/tokens.module';
import { PricesModule } from './prices/prices.module';
import { P2PModule } from './p2p/p2p.module';
import { ConfigAppModule } from './config/config.module';
import { AdminModule } from './admin/admin.module';

@Module({
  imports: [
    ConfigModule.forRoot({
      isGlobal: true,
    }),
    ScheduleModule.forRoot(),
    PrismaModule,
    AuthModule,
    TokensModule,
    PricesModule,
    P2PModule,
    ConfigAppModule,
    AdminModule,
  ],
})
export class AppModule {}

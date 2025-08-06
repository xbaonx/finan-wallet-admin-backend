import { Module } from '@nestjs/common';
import { AdminController } from './admin.controller';
import { P2PModule } from '../p2p/p2p.module';
import { ConfigAppModule } from '../config/config.module';

@Module({
  imports: [P2PModule, ConfigAppModule],
  controllers: [AdminController],
})
export class AdminModule {}

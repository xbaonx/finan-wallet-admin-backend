import { Module } from '@nestjs/common';
import { P2PService } from './p2p.service';
import { P2PController } from './p2p.controller';
import { ConfigAppModule } from '../config/config.module';

@Module({
  imports: [ConfigAppModule],
  controllers: [P2PController],
  providers: [P2PService],
  exports: [P2PService],
})
export class P2PModule {}

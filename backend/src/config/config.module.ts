import { Module } from '@nestjs/common';
import { ConfigAppService } from './config.service';
import { ConfigAppController } from './config.controller';

@Module({
  controllers: [ConfigAppController],
  providers: [ConfigAppService],
  exports: [ConfigAppService],
})
export class ConfigAppModule {}

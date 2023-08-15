import { Module } from '@nestjs/common';

import { DataModule } from '@api/data';

import { HealthController } from './controllers';

@Module({
  imports: [DataModule],
  controllers: [HealthController],
  providers: [],
  exports: []
})
export class InfrastructureModule {}

import { Module } from '@nestjs/common';

import { DataModule } from '@api/data';
import { UserModule } from '@api/user';

import { StoreController } from './controllers';
import { StoreService } from './services';

@Module({
  imports: [DataModule, UserModule],
  controllers: [StoreController],
  providers: [StoreService],
  exports: [StoreService]
})
export class StoreModule {}

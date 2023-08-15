import { Module } from '@nestjs/common';

import { DataModule } from '@api/data';
import { StoreModule } from '@api/store';

import { PetController } from './controllers';
import { PetService } from './services';

@Module({
  imports: [DataModule, StoreModule],
  controllers: [PetController],
  providers: [PetService],
  exports: [PetService]
})
export class PetModule {}

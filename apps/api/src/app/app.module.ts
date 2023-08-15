import { Module } from '@nestjs/common';

import { AuthModule } from '@api/auth';
import { CommonModule } from '@api/common';
import { DataModule } from '@api/data';
import { InfrastructureModule } from '@api/infra';
import { PetModule } from '@api/pet';
import { StoreModule } from '@api/store';

@Module({
  imports: [
    DataModule,
    AuthModule,
    InfrastructureModule,
    CommonModule,
    PetModule,
    StoreModule
  ]
})
export class AppModule {}

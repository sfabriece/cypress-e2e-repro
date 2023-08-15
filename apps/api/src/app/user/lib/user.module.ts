import { Module } from '@nestjs/common';

import { DataModule } from '@api/data';

import { UserController } from './controllers';
import { UserService } from './services/user.service';

@Module({
  imports: [DataModule],
  controllers: [UserController],
  providers: [UserService],
  exports: [UserService]
})
export class UserModule {}

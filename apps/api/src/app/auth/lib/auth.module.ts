import { Module } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';
import { APP_GUARD } from '@nestjs/core';
import { JwtModule } from '@nestjs/jwt';

import { AccessTokenGuard } from '@api/common';
import { appConfiguration } from '@api/config';
import { DataModule } from '@api/data';
import { UserModule } from '@api/user';

import { AuthJwtController } from './controllers';
import { AuthService } from './services';
import { JwtStrategy, RefreshTokenStrategy } from './strategies';

@Module({
  imports: [
    ConfigModule.forRoot({
      isGlobal: true,
      load: [appConfiguration]
    }),
    UserModule,
    DataModule,
    JwtModule.register({})
  ],
  controllers: [AuthJwtController],
  providers: [
    AuthService,
    JwtStrategy,
    RefreshTokenStrategy,
    {
      provide: APP_GUARD,
      useClass: AccessTokenGuard
    }
  ],
  exports: [AuthService]
})
export class AuthModule {}

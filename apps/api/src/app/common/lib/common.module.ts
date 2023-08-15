import { Module } from '@nestjs/common';

// import { APP_GUARD } from '@nestjs/core';
// import { AccessGuard } from './guards';

@Module({
  controllers: [],
  providers: [
    // {
    //   provide: APP_GUARD,
    //   // useClass: JwtGuard,
    //   useValue: AccessGuard,
    // },
  ],
  exports: []
})
export class CommonModule {}

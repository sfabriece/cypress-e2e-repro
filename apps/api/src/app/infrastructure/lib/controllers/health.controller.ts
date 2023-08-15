import { Controller, Get, HttpCode, HttpStatus } from '@nestjs/common';
import { ApiTags } from '@nestjs/swagger';

import { Public } from '@api/common';

@ApiTags('Health')
@Controller()
export class HealthController {
  @Get('/health')
  @HttpCode(HttpStatus.OK)
  @Public()
  public async health(): Promise<string> {
    return 'K';
  }
}

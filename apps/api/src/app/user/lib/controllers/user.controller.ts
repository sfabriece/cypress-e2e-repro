import {
  Body,
  Controller,
  Get,
  HttpCode,
  HttpStatus,
  Logger,
  NotFoundException,
  Put
} from '@nestjs/common';
import { ApiBearerAuth, ApiTags } from '@nestjs/swagger';

import { CurrentUserId } from '@api/common';

import { UpdateUserDto, UserDto } from '../dto';
import { UserService } from '../services';

const USER_NOT_FOUND = 'User not found';

@ApiTags('User')
@Controller('user')
@ApiBearerAuth()
export class UserController {
  private readonly logger = new Logger(UserController.name);

  constructor(private userService: UserService) {}

  @Get('/me')
  @HttpCode(HttpStatus.OK)
  public async me(@CurrentUserId() userId: string): Promise<UserDto> {
    const user = await this.userService.getUserById(userId);

    if (!user) {
      this.logger.error(`User with id ${userId} not found`);
      throw new NotFoundException(USER_NOT_FOUND);
    }

    return user;
  }

  @Put('/me')
  @HttpCode(HttpStatus.OK)
  public async updateUserInfo(
    @CurrentUserId() userId: string,
    @Body() payload: UpdateUserDto
  ): Promise<UserDto> {
    const user = await this.userService.updateUser(userId, payload);

    if (!user) {
      this.logger.error(`User with id ${userId} not found`);
      throw new NotFoundException(USER_NOT_FOUND);
    }

    return user;
  }
}

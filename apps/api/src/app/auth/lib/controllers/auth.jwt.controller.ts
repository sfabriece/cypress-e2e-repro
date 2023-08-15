import {
  BadRequestException,
  Body,
  Controller,
  Get,
  HttpCode,
  HttpStatus,
  Logger,
  Post,
  UseGuards
} from '@nestjs/common';
import { ApiBearerAuth, ApiTags } from '@nestjs/swagger';
import { v4 } from 'uuid';

import {
  CurrentUser,
  CurrentUserId,
  Public,
  RefreshTokenGuard
} from '@api/common';
import { UserCreateDto, UserDto, UserService } from '@api/user';

import {
  AuthResponseDto,
  LoginDto,
  NewPasswordDto,
  ResetPasswordDto
} from '../dto';
import { AuthService } from '../services';

@ApiTags('Auth')
@Controller('auth')
export class AuthJwtController {
  private readonly logger = new Logger(AuthJwtController.name);

  constructor(
    private readonly authService: AuthService,
    private readonly userService: UserService
  ) {}

  @Public()
  @HttpCode(HttpStatus.CREATED)
  @Post('signup')
  public async signup(@Body() dto: UserCreateDto): Promise<AuthResponseDto> {
    return this.authService.signupLocal(dto);
  }

  @Public()
  @Post('/login')
  @HttpCode(HttpStatus.OK)
  public login(@Body() dto: LoginDto): Promise<AuthResponseDto> {
    return this.authService.loginLocal(dto);
  }

  @Public()
  @Post('/renew')
  @HttpCode(HttpStatus.OK)
  public async newPassword(
    @Body() { password, token }: NewPasswordDto
  ): Promise<void> {
    const user = await this.userService.getUserByResetToken(token);

    if (!user) {
      this.logger.error('NewPassword->>reset token not valid');
      throw new BadRequestException('Wrong email or password');
    }

    await this.authService.changePassword(user.id, password);
  }

  @ApiBearerAuth()
  @Post('logout')
  @HttpCode(HttpStatus.OK)
  public async logout(@CurrentUserId() userId: string): Promise<boolean> {
    await this.authService.logout(userId);
    return true;
  }

  @Public()
  @HttpCode(HttpStatus.OK)
  @Post('reset')
  public async resetPassword(@Body() dto: ResetPasswordDto): Promise<void> {
    const user = await this.userService.findByEmail(dto.email);

    if (!user) {
      this.logger.error('ResetPassword->>User not found');
      throw new BadRequestException('Email not found');
    }

    const store = await this.userService.getUserStore(user.id);

    if (!store) {
      this.logger.error('ResetPassword->>Store not found');
      throw new BadRequestException('Wrong email or password');
    }

    const token = v4();

    await this.authService.updatePasswordResetToken(user.id, token);
  }

  @ApiBearerAuth()
  @Post('complete-onboarding')
  @HttpCode(HttpStatus.OK)
  public async completeOnboarding(
    @CurrentUserId() userId: string
  ): Promise<boolean> {
    const succeeded = await this.authService.onboardingCompleted(userId);

    if (!succeeded) {
      this.logger.error('Could not complete onboarding');
      throw new BadRequestException(
        'Could not complete onboarding, please try again later'
      );
    }

    return succeeded;
  }

  @ApiBearerAuth()
  @Post('advance-onboarding')
  @HttpCode(HttpStatus.OK)
  public async advanceOnboarding(
    @CurrentUserId() userId: string
  ): Promise<UserDto> {
    const user = await this.authService.advanceOnboarding(userId);

    if (!user) {
      throw new BadRequestException(
        'Could not advance onboarding, please try again later'
      );
    }

    return user;
  }

  @Public()
  @UseGuards(RefreshTokenGuard)
  @Get('/refresh')
  @HttpCode(HttpStatus.OK)
  async refreshToken(
    @CurrentUserId() userId: string,
    @CurrentUser('refreshToken') refreshToken: string
  ): Promise<AuthResponseDto> {
    return this.authService.refreshTokens(userId, refreshToken);
  }
}

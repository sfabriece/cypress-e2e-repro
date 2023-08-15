import {
  BadRequestException,
  Inject,
  Injectable,
  Logger,
  UnauthorizedException
} from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import * as argon from 'argon2';

import { AppConfiguration, appConfiguration } from '@api/config';
import { DataService } from '@api/data';
import { UserCreateDto, UserService } from '@api/user';

import { accessTokenExpiresIn, refreshTokenExpiresIn } from '../auth.constants';
import type { IJwt, ILoginDto, JwtPayload } from '../interfaces';

const AUTHENTICATION_ERROR = 'Wrong email or password';

@Injectable()
export class AuthService {
  private readonly logger = new Logger(AuthService.name);

  constructor(
    @Inject(appConfiguration.KEY) readonly config: AppConfiguration,
    private readonly prisma: DataService,
    private readonly userService: UserService,
    private readonly jwtService: JwtService
  ) {}

  async signupLocal(dto: UserCreateDto): Promise<IJwt> {
    const { email, password } = dto;

    const hash = await argon.hash(password);

    const user = await this.userService.create({
      email,
      password: hash
    });

    const tokens = await this.getTokens(user.id);
    await this.updateRefreshTokentHash(user.id, tokens.refreshToken);

    return tokens;
  }

  async loginLocal(dto: ILoginDto): Promise<IJwt> {
    const { email, password } = dto;

    const user = await this.userService.findByEmail(email);

    if (!user) {
      this.logger.error(`User with email ${email} not found`);
      throw new UnauthorizedException(AUTHENTICATION_ERROR);
    }

    const credentials = await this.getUserCredentials(user.id);
    if (!credentials) {
      this.logger.error(`User with id ${user.id} has no credentials`);
      throw new UnauthorizedException(AUTHENTICATION_ERROR);
    }

    const passwordMatches = await argon.verify(
      credentials.passwordHash,
      password
    );
    if (!passwordMatches) {
      this.logger.error(`Password for user with id ${user.id} does not match`);
      throw new UnauthorizedException(AUTHENTICATION_ERROR);
    }

    const tokens = await this.getTokens(user.id);
    await this.updateRefreshTokentHash(user.id, tokens.refreshToken);

    await this.removePasswordResetToken(user.id);

    return tokens;
  }

  async logout(userId: string): Promise<boolean> {
    await this.prisma.session.deleteMany({
      where: {
        userId
      }
    });

    return true;
  }

  async refreshTokens(userId: string, refreshToken: string): Promise<IJwt> {
    const user = await this.userService.getUserById(userId);

    if (!user) {
      this.logger.error(`User with id ${userId} not found`);
      throw new UnauthorizedException('Not valid');
    }

    const session = await this.getUserSession(userId);
    if (!session) {
      this.logger.error(`User with id ${userId} has no session`);
      throw new UnauthorizedException('Not valid');
    }

    const refreshTokenMatches = await argon.verify(
      session.refreshTokenHash,
      refreshToken
    );
    if (!refreshTokenMatches) {
      this.logger.error(
        `Refresh token for user with id ${userId} does not match hash`
      );
      throw new UnauthorizedException('Not valid');
    }

    const tokens = await this.getTokens(user.id);
    await this.updateRefreshTokentHash(user.id, tokens.refreshToken);

    return tokens;
  }

  async updatePasswordResetToken(userId: string, token: string) {
    await this.prisma.credentials.update({
      where: {
        userId
      },
      data: {
        resetPasswordToken: token
      }
    });
  }

  async getPasswordResetToken(userId: string) {
    const creds = await this.prisma.credentials.findUnique({
      where: {
        userId
      }
    });

    return creds?.resetPasswordToken ?? null;
  }

  async onboardingCompleted(userId: string): Promise<boolean> {
    const user = await this.userService.updateUser(userId, {
      finishedOnboarding: true,
      currentOnboardingStep: null
    });

    return !!user;
  }

  async advanceOnboarding(userId: string) {
    const user = await this.userService.getUserById(userId);

    if (!user) {
      this.logger.error(`User with id ${userId} not found`);
      throw new UnauthorizedException('Not valid');
    }

    if (user.finishedOnboarding) {
      this.logger.error(
        `User with id ${userId} has already finished onboarding`
      );
      throw new BadRequestException('Not valid');
    }

    if (!user.currentOnboardingStep) {
      this.logger.error(
        `User with id ${userId} has no current onboarding step`
      );
      throw new BadRequestException('Not valid');
    }

    if (user.currentOnboardingStep === 3) {
      this.logger.error(
        `User with id ${userId} has already finished onboarding`
      );
      throw new BadRequestException('Not valid');
    }

    const nextStep = user.currentOnboardingStep! + 1;

    const updatedUser = await this.userService.updateUser(userId, {
      currentOnboardingStep: nextStep
    });

    return updatedUser;
  }

  private async getUserCredentials(userId: string) {
    return this.prisma.credentials.findUnique({
      where: {
        userId
      }
    });
  }

  private async getUserSession(userId: string) {
    return this.prisma.session.findUnique({
      where: {
        userId
      }
    });
  }

  private async updateRefreshTokentHash(
    userId: string,
    refreshToken: string
  ): Promise<void> {
    const hash = await argon.hash(refreshToken);

    await this.prisma.session.upsert({
      where: {
        userId
      },
      create: {
        userId,
        refreshTokenHash: hash
      },
      update: {
        refreshTokenHash: hash
      }
    });
  }

  private async getTokens(userId: string): Promise<IJwt> {
    const jwtPayload: JwtPayload = {
      sub: userId
    };

    const [accessToken, refreshToken] = await Promise.all([
      this.jwtService.signAsync(jwtPayload, {
        secret: this.config.JWT_SECRET_KEY,
        expiresIn: accessTokenExpiresIn
      }),
      this.jwtService.signAsync(jwtPayload, {
        secret: this.config.JWT_REFRESH_SECRET_KEY,
        expiresIn: refreshTokenExpiresIn
      })
    ]);

    return {
      accessToken,
      refreshToken
    };
  }

  async changePassword(userId: string, password: string) {
    const hash = await argon.hash(password);

    await this.prisma.credentials.update({
      where: {
        userId
      },
      data: {
        passwordHash: hash,
        resetPasswordToken: null
      }
    });
  }

  private async removePasswordResetToken(userId: string) {
    await this.prisma.credentials.update({
      where: {
        userId
      },
      data: {
        resetPasswordToken: null
      }
    });
  }
}

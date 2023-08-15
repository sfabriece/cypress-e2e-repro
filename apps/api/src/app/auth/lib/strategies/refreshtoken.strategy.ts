import {
  Inject,
  Injectable,
  Logger,
  UnauthorizedException
} from '@nestjs/common';
import { PassportStrategy } from '@nestjs/passport';
import { type Request } from 'express';
import { ExtractJwt, Strategy } from 'passport-jwt';

import { AppConfiguration, appConfiguration } from '@api/config';

import { JwtPayload, JwtPayloadWithRefreshToken } from '../interfaces';

@Injectable()
export class RefreshTokenStrategy extends PassportStrategy(
  Strategy,
  'jwt-refresh'
) {
  private readonly logger = new Logger(RefreshTokenStrategy.name);

  constructor(@Inject(appConfiguration.KEY) readonly config: AppConfiguration) {
    super({
      jwtFromRequest: ExtractJwt.fromAuthHeaderAsBearerToken(),
      ignoreExpiration: false,
      secretOrKey: config.JWT_REFRESH_SECRET_KEY,
      passReqToCallback: true
    });
  }

  validate(request: Request, payload: JwtPayload): JwtPayloadWithRefreshToken {
    const refreshToken = request
      ?.get('authorization')
      ?.replace('Bearer', '')
      .trim();

    if (!refreshToken) {
      this.logger.error('Refresh token not found');
      throw new UnauthorizedException('Refresh token malformed');
    }

    return {
      ...payload,
      refreshToken
    };
  }
}

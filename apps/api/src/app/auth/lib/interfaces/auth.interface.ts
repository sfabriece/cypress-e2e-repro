import type {
  AuthResponseDto,
  JwtLogoutDto,
  JwtRefreshTokenDto,
  LoginDto,
  NewPasswordDto,
  ResetPasswordDto
} from '../dto';

export type JwtPayload = {
  sub: string;
};

export type JwtPayloadWithRefreshToken = JwtPayload & { refreshToken: string };

export type IJwt = AuthResponseDto;

export type ILoginDto = LoginDto;

export type ILogoutDto = JwtLogoutDto;

export type IRefreshDto = JwtRefreshTokenDto;

export type IResetPassword = ResetPasswordDto;

export type INewPassword = NewPasswordDto;

import { PickType } from '@nestjs/swagger';
import { IsEmail, IsJWT, IsUUID, MaxLength, MinLength } from 'class-validator';

export class LoginDto {
  @IsEmail()
  email: string;

  @MinLength(8)
  @MaxLength(64)
  password: string;
}

export class JwtLogoutDto {
  @IsJWT()
  refreshToken!: string;
}

export class JwtRefreshTokenDto {
  @IsJWT()
  refreshToken!: string;
}

export class AuthResponseDto {
  @IsJWT()
  accessToken: string;

  @IsJWT()
  refreshToken: string;
}

export class ResetPasswordDto extends PickType(LoginDto, ['email'] as const) {}

export class NewPasswordDto extends PickType(LoginDto, ['password'] as const) {
  @IsUUID('4')
  token: string;
}

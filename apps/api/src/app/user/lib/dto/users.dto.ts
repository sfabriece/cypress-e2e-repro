import { PickType } from '@nestjs/swagger';
import {
  IsBoolean,
  IsDate,
  IsEmail,
  IsIn,
  IsString,
  IsUrl,
  MaxLength,
  MinLength,
  ValidateIf
} from 'class-validator';

import type { User } from '@api/data';

interface IUserCreateDto {
  email: string;
  password: string;
}

export class UserDto implements User {
  @IsString()
  id: string;

  @IsEmail()
  email: string;

  @MinLength(2)
  @ValidateIf((_, value) => value !== null)
  firstName: string | null;

  @MinLength(2)
  @ValidateIf((_, value) => value !== null)
  lastName: string | null;

  @IsUrl()
  @ValidateIf((_, value) => value !== null)
  avatarUrl: string | null;

  @MinLength(8)
  @ValidateIf((_, value) => value !== null)
  phone: string | null;

  @IsBoolean()
  finishedOnboarding: boolean;

  @IsIn([1, 2, 3, 4] as const)
  @ValidateIf((_, value) => value !== null)
  currentOnboardingStep: number | null;

  @IsDate()
  createdAt: Date;

  @IsDate()
  updatedAt: Date;
}

export class UserCreateDto implements IUserCreateDto {
  @IsEmail()
  email!: string;

  @MinLength(8)
  @MaxLength(64)
  password!: string;
}

export class UpdateUserDto extends PickType(UserDto, [
  'firstName',
  'lastName',
  'phone'
] as const) {}

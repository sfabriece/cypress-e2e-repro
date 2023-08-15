import { OmitType, PartialType, PickType } from '@nestjs/swagger';
import { Type } from 'class-transformer';
import {
  IsDate,
  IsEmail,
  IsString,
  Length,
  MinLength,
  ValidateIf,
  ValidateNested
} from 'class-validator';

import type { Store } from '@api/data';

type StoreWithoutAddress = Pick<
  Store,
  | 'id'
  | 'name'
  | 'organizationNumber'
  | 'contactEmail'
  | 'phone'
  | 'ownerId'
  | 'createdAt'
  | 'updatedAt'
>;
type IStoreAddress = Pick<
  Store,
  'streetAddress' | 'city' | 'postalCode' | 'country'
>;

class StoreAddressDto implements IStoreAddress {
  @MinLength(1)
  streetAddress: string;

  @MinLength(1)
  city: string;

  @MinLength(1)
  postalCode: string;

  @MinLength(1)
  country: string;
}

export interface IStore extends StoreWithoutAddress {
  address: IStoreAddress;
}

export class StoreDto implements IStore {
  @IsString()
  id: string;

  @MinLength(3)
  name: string;

  @Length(9, 9)
  organizationNumber: string;

  @ValidateNested()
  @Type(() => StoreAddressDto)
  address: StoreAddressDto;

  @IsEmail()
  @ValidateIf((_, value) => value !== null)
  contactEmail: string | null;

  @IsString()
  @ValidateIf((_, value) => value !== null)
  phone: string | null;

  @MinLength(3)
  ownerId: string;

  @IsDate()
  createdAt: Date;

  @IsDate()
  updatedAt: Date;
}

export class CreateStoreDto extends PickType(StoreDto, [
  'name',
  'organizationNumber',
  'address'
] as const) {}

export class UpdateStoreDto extends PartialType(
  OmitType(StoreDto, ['ownerId', 'createdAt', 'updatedAt'] as const)
) {}

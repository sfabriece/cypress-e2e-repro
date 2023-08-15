import { PartialType, PickType } from '@nestjs/swagger';
import {
  IsDate,
  IsDateString,
  IsIn,
  IsNumber,
  IsString,
  ValidateIf
} from 'class-validator';

import { type Pet } from '@api/data';

const statuses = ['DRAFT', 'SUBMITTED', 'RETURNED'] as const;
const PetKindEnum = ['MAMMAL', 'REPTIL'] as const;

export class PetDto implements Pet {
  @IsString()
  id: string;

  @IsIn(PetKindEnum)
  kind: string;

  @IsIn(statuses)
  status: string;

  @IsString()
  storeId: string;

  @IsString()
  userId: string;

  @IsNumber()
  @ValidateIf((_, value) => value !== null)
  number: number | null;

  @IsString()
  @ValidateIf((_, value) => value !== null)
  description: string | null;

  @IsDate()
  submitDate: Date;

  @IsDate()
  createdAt: Date;

  @IsDate()
  updatedAt: Date;
}

export class ExtendedPetDto extends PetDto {}

export class FullPetDto extends PetDto {}

export class CreatePetDto extends PickType(PetDto, [
  'description',
  'kind'
] as const) {
  @IsDateString()
  submitDate: string;
}

export class UpdatePetDto extends PartialType(CreatePetDto) {}

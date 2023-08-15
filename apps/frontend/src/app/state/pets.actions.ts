import type { ICreatePetDto, IUpdatePetDto } from '@api/types';

export class LoadPets {
  static readonly type = '[Pets] Load Pets';
}

export class LoadPetsFailed {
  static readonly type = '[Pets] Load Pets Failed';
  constructor(public error: string) {}
}

export class CreatePet {
  static readonly type = '[Pets] Create Pet';
  constructor(public payload: ICreatePetDto) {}
}

export class CreatePetFailed {
  static readonly type = '[Pets] Create Pet Failed';
  constructor(public error: string) {}
}

export class UpdatePet {
  static readonly type = '[Pets] Update Pet';
  constructor(
    public petId: string,
    public payload: IUpdatePetDto
  ) {}
}

export class UpdatePetFailed {
  static readonly type = '[Pets] Update Pet Failed';
  constructor(public error: string) {}
}

export class DeletePet {
  static readonly type = '[Pets] Delete Pet';
  constructor(public petId: string) {}
}

export class DeletePetSuccess {
  static readonly type = '[Pets] Delete Pet Success';
}

export class DeletePetFailed {
  static readonly type = '[Pets] Delete Pet Failed';
  constructor(public error: string) {}
}

export class LoadFullPet {
  static readonly type = '[Pets] Load Full Pet';
  constructor(public petId: string) {}
}

export class LoadFullPetFailed {
  static readonly type = '[Pets] Load Full Pet Failed';
  constructor(public error: string) {}
}

export class DuplicatePet {
  static readonly type = '[Pets] Duplicate Pet';
  constructor(public petId: string) {}
}

export class DuplicatePetFailed {
  static readonly type = '[Pets] Duplicate Pet Failed';
  constructor(public error: string) {}
}

export class SubmitPet {
  static readonly type = '[Pets] Submit Pet';
  constructor(public petId: string) {}
}

export class SubmitPetFailed {
  static readonly type = '[Pets] Submit Pet Failed';
  constructor(public error: string) {}
}

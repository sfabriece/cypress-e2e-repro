import type { ICreateStore, IUpdateStore } from '@api/types';

export class LoadStoreData {
  static readonly type = '[Global] Load Store State Data';
}

export class CreateStore {
  static readonly type = '[Settings] Create Store';
  constructor(public payload: ICreateStore) {}
}

export class CreateStoreSuccess {
  static readonly type = '[Settings] Create Store Success';
}

export class CreateStoreFailed {
  static readonly type = '[Settings] Create Store Failed';
  constructor(public error: string) {}
}

export class UpdateStore {
  static readonly type = '[Settings] Update Store';
  constructor(public payload: IUpdateStore) {}
}

export class UpdateStoreSuccess {
  static readonly type = '[Settings] Update Store Success';
}

export class UpdateStoreFailed {
  static readonly type = '[Settings] Update Store Failed';
  constructor(public error: string) {}
}

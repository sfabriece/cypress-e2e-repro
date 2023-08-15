import { Injectable } from '@angular/core';
import { Action, Selector, State, StateContext } from '@ngxs/store';
import { catchError, tap } from 'rxjs';

import type { IStore } from '@api/types';

import { StoreService } from '../services/store.service';
import { ToastrService } from '../services/toastr.service';
import { ResetState } from './auth.actions';
import * as StoreActions from './store.actions';

export interface StoreStateModel {
  store: IStore | null;
}

const DEFAULT_STORE_STATE: StoreStateModel = {
  store: null
};

@State<StoreStateModel>({
  name: 'store',
  defaults: DEFAULT_STORE_STATE
})
@Injectable()
export class StoreState {
  constructor(
    private storeService: StoreService,
    private toast: ToastrService
  ) {}

  @Selector()
  static store(state: StoreStateModel): IStore | null {
    return state.store;
  }

  @Action(StoreActions.LoadStoreData)
  loadStoreData(context: StateContext<StoreStateModel>) {
    return this.storeService.getStoreData().pipe(
      tap((storeData) => {
        context.patchState(storeData);
      })
    );
  }

  @Action(StoreActions.CreateStore)
  createStore(
    context: StateContext<StoreStateModel>,
    action: StoreActions.CreateStore
  ) {
    return this.storeService.createStore(action.payload).pipe(
      tap((store) => {
        context.patchState({
          store
        });

        context.dispatch(new StoreActions.CreateStoreSuccess());
      }),
      catchError((error) =>
        context.dispatch(new StoreActions.CreateStoreFailed(error))
      )
    );
  }

  @Action(StoreActions.UpdateStore)
  updateStore(
    context: StateContext<StoreStateModel>,
    action: StoreActions.UpdateStore
  ) {
    return this.storeService.updateStore(action.payload).pipe(
      tap((store) => {
        context.patchState({
          store
        });

        context.dispatch(new StoreActions.UpdateStoreSuccess());
      }),
      catchError((error) =>
        context.dispatch(new StoreActions.UpdateStoreFailed(error))
      )
    );
  }

  @Action(StoreActions.UpdateStoreSuccess)
  UpdateStoreSuccess() {
    this.toast.successToast({
      header: 'Success',
      text: 'Store updated'
    });
  }

  @Action([ResetState])
  onResetState(context: StateContext<StoreStateModel>) {
    context.patchState(DEFAULT_STORE_STATE);
  }

  @Action([StoreActions.CreateStoreFailed, StoreActions.UpdateStoreFailed])
  onFailure(
    _: StateContext<StoreStateModel>,
    action: StoreActions.CreateStoreFailed
  ) {
    if (action.error) {
      this.toast.dangerToast({
        header: '',
        text: action.error
      });
    }
  }
}

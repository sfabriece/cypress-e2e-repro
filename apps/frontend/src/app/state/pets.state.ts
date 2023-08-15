import { Injectable } from '@angular/core';
import { Navigate } from '@ngxs/router-plugin';
import {
  Action,
  createSelector,
  Selector,
  State,
  StateContext
} from '@ngxs/store';
import { patch, updateItem } from '@ngxs/store/operators';
import { catchError, tap } from 'rxjs';

import type { IExtendedPet } from '@api/types';

import { PetsService } from '../services/pets.service';
import { ToastrService } from '../services/toastr.service';
import { ResetState } from './auth.actions';
import * as PetsActions from './pets.actions';

export interface PetsStateModel {
  pets: IExtendedPet[];
  selectedPet: IExtendedPet | null;
  isLoading: boolean;
}

const DEFAULT_PET_STATE: PetsStateModel = {
  pets: [],
  selectedPet: null,
  isLoading: false
};

@State<PetsStateModel>({
  name: 'pets',
  defaults: DEFAULT_PET_STATE
})
@Injectable()
export class PetsState {
  constructor(
    private petsService: PetsService,
    private toast: ToastrService
  ) {}

  @Selector()
  static getPet(id: string) {
    return createSelector([PetsState], (state) => {
      const PetsState: PetsStateModel = state.pets;
      return PetsState.pets.find((pet) => pet.id === id);
    });
  }

  @Selector()
  static selectPets(state: PetsStateModel) {
    return state.pets.filter((pet) => pet.kind === 'MAMMAL');
  }

  @Action(PetsActions.LoadPets)
  loadPets(context: StateContext<PetsStateModel>) {
    return this.petsService.getPets().pipe(
      tap((pets) => {
        context.patchState({
          pets
        });
      })
    );
  }

  @Action(PetsActions.CreatePet)
  createPet(
    context: StateContext<PetsStateModel>,
    action: PetsActions.CreatePet
  ) {
    return this.petsService.createPet(action.payload).pipe(
      tap((pet) => {
        const state = context.getState();

        context.patchState({
          pets: [...state.pets, pet]
        });

        this.toast.successToast({
          header: 'Success',
          text: 'Pet created'
        });
        context.dispatch(new Navigate(['/pets/', pet.id]));
      }),
      catchError((error) =>
        context.dispatch(new PetsActions.CreatePetFailed(error))
      )
    );
  }

  @Action(PetsActions.UpdatePet)
  updatePet(
    context: StateContext<PetsStateModel>,
    action: PetsActions.UpdatePet
  ) {
    return this.petsService.updatePet(action.petId, action.payload).pipe(
      tap((updatedPet) => {
        context.setState(
          patch<PetsStateModel>({
            pets: updateItem<IExtendedPet>((pet) => pet?.id === updatedPet.id, {
              ...context.getState().pets.find((pet) => pet.id === action.petId),
              ...updatedPet
            })
          })
        );

        this.toast.successToast({
          header: 'Success',
          text: 'Pet updated'
        });
      }),
      catchError((error) =>
        context.dispatch(new PetsActions.UpdatePetFailed(error))
      )
    );
  }

  @Action(PetsActions.SubmitPet)
  sendPet(
    context: StateContext<PetsStateModel>,
    action: PetsActions.SubmitPet
  ) {
    return this.petsService.submitPet(action.petId).pipe(
      tap((submittedPet) => {
        context.setState(
          patch<PetsStateModel>({
            pets: updateItem<IExtendedPet>(
              (pet) => pet?.id === submittedPet.id,
              {
                ...context
                  .getState()
                  .pets.find((pet) => pet.id === action.petId),
                ...submittedPet
              }
            )
          })
        );

        this.toast.successToast({
          header: 'Success',
          text: 'Pet submitted'
        });

        context.dispatch(new Navigate(['/pets/submitted/', action.petId]));
      }),
      catchError((error) =>
        context.dispatch(new PetsActions.SubmitPetFailed(error))
      )
    );
  }

  @Action(PetsActions.DuplicatePet)
  duplicatePet(
    context: StateContext<PetsStateModel>,
    action: PetsActions.DuplicatePet
  ) {
    return context.dispatch(
      new Navigate(['/pets/', 'new'], { from: action.petId })
    );
  }

  @Action(PetsActions.DeletePet)
  deletePet(
    context: StateContext<PetsStateModel>,
    action: PetsActions.DeletePet
  ) {
    return this.petsService.deletePet(action.petId).pipe(
      tap(() => {
        const state = context.getState();

        context.patchState({
          pets: state.pets.filter((pet) => pet.id !== action.petId)
        });

        this.toast.successToast({
          header: 'Success',
          text: 'Pet deleted'
        });

        context.dispatch(new Navigate(['/pets']));
      }),
      catchError((error) =>
        context.dispatch(new PetsActions.DeletePetFailed(error))
      )
    );
  }

  @Action(PetsActions.LoadFullPet)
  loadFullPet(
    context: StateContext<PetsStateModel>,
    action: PetsActions.LoadFullPet
  ) {
    return this.petsService.getFullPet(action.petId).pipe(
      tap((pet) => {
        context.patchState({
          selectedPet: pet
        });
      })
    );
  }

  @Action([
    PetsActions.DeletePetFailed,
    PetsActions.LoadPetsFailed,
    PetsActions.LoadFullPetFailed,
    PetsActions.CreatePetFailed,
    PetsActions.UpdatePetFailed,
    PetsActions.DuplicatePetFailed,
    PetsActions.SubmitPetFailed
  ])
  onFailure(
    _: StateContext<PetsStateModel>,
    action: PetsActions.DeletePetFailed
  ) {
    if (action.error) {
      this.toast.dangerToast({
        header: '',
        text: action.error
      });
    }
  }

  @Action([ResetState])
  onResetState(context: StateContext<PetsStateModel>) {
    context.patchState(DEFAULT_PET_STATE);
  }
}

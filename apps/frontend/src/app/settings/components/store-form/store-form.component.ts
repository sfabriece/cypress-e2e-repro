import { AsyncPipe, NgIf } from '@angular/common';
import { Component, EventEmitter, Input, Output } from '@angular/core';
import {
  FormControl,
  FormGroup,
  FormsModule,
  ReactiveFormsModule,
  Validators
} from '@angular/forms';
import { IonicModule } from '@ionic/angular';
import { Store } from '@ngxs/store';
import { map } from 'rxjs';

import type { ICreateStore } from '@api/types';

import { AuthState } from '../../../state/auth.state';
import { CreateStore, UpdateStore } from '../../../state/store.actions';
import { StoreState } from '../../../state/store.state';

@Component({
  selector: 'innut-store-form',
  templateUrl: './store-form.component.html',
  styleUrls: ['./store-form.component.scss'],
  standalone: true,
  imports: [NgIf, FormsModule, ReactiveFormsModule, IonicModule, AsyncPipe]
})
export class StoreFormComponent {
  @Input() submitButtonText = 'Save';
  @Output() isFormValid = new EventEmitter<boolean>();

  storeWrapper$ = this.store.select(StoreState.store).pipe(
    map((store) => {
      if (store) {
        this.storeForm.patchValue({
          ...store
        });
      }

      return {
        store
      };
    })
  );

  finishedOnboardingWrapper$ = this.store
    .select(AuthState.finishedOnboarding)
    .pipe(
      map((finishedOnboarding) => {
        return {
          finishedOnboarding
        };
      })
    );

  storeForm = new FormGroup({
    name: new FormControl<string | null>(null, Validators.required),
    organizationNumber: new FormControl<string | null>(null, [
      Validators.required,
      Validators.pattern(/^\d{9}$/)
    ]),
    address: new FormGroup({
      streetAddress: new FormControl<string | null>(null, Validators.required),
      city: new FormControl<string | null>(null, Validators.required),
      postalCode: new FormControl<string | null>(null, [
        Validators.required,
        Validators.pattern(/^\d{4}$/)
      ]),
      country: new FormControl<string | null>('Norge', Validators.required)
    })
  });

  formSubmitted = false;

  constructor(private store: Store) {}

  submit(finishedOnboarding: boolean | null): void {
    this.formSubmitted = true;

    if (this.storeForm.valid) {
      const payload: ICreateStore = {
        /* eslint-disable @typescript-eslint/no-non-null-assertion, @typescript-eslint/no-non-null-asserted-optional-chain */
        name: this.storeForm.value.name!,
        organizationNumber: this.storeForm.value.organizationNumber!,
        address: {
          streetAddress: this.storeForm.value.address?.streetAddress!,
          city: this.storeForm.value.address?.city!,
          postalCode: this.storeForm.value.address?.postalCode!,
          country: this.storeForm.value.address?.country!
        }
      };
      /* eslint-enable @typescript-eslint/no-non-null-assertion, @typescript-eslint/no-non-null-asserted-optional-chain */

      if (finishedOnboarding === false) {
        this.store.dispatch(new CreateStore(payload as ICreateStore));
      } else {
        this.store.dispatch(new UpdateStore(payload));
      }

      this.isFormValid.emit(true);
    }
  }

  handleKeyUp(event: KeyboardEvent, finishedOnboarding: boolean | null): void {
    if (event.key === 'Enter') {
      this.submit(finishedOnboarding);
    }
  }
}

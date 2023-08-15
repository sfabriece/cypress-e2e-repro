import { AsyncPipe, NgIf } from '@angular/common';
import { Component } from '@angular/core';
import { IonicModule } from '@ionic/angular';
import { Store } from '@ngxs/store';
import { map } from 'rxjs/operators';

import { StoreFormComponent } from '../settings/components/store-form/store-form.component';
import { UserFormComponent } from '../settings/components/user-form/user-form.component';
import { CompleteOnboarding } from '../state/auth.actions';
import { AuthState } from '../state/auth.state';
import { StepIndicatorComponent } from './step-indicator/step-indicator.component';

@Component({
  selector: 'innut-onboarding',
  templateUrl: './onboarding.page.html',
  styleUrls: ['./onboarding.page.scss'],
  standalone: true,
  imports: [
    IonicModule,
    NgIf,
    StepIndicatorComponent,
    UserFormComponent,
    StoreFormComponent,
    AsyncPipe
  ]
})
export class OnboardingPage {
  currentStep$ = this.store
    .select(AuthState.user)
    .pipe(map((user) => user?.currentOnboardingStep));

  constructor(private store: Store) {}

  nextStep(event: boolean, step: number) {
    if (!event) {
      return;
    }

    if (step > 1) {
      this.store.dispatch(new CompleteOnboarding());
    }
  }
}

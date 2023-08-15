import { Injectable } from '@angular/core';
import { Navigate } from '@ngxs/router-plugin';
import { Store } from '@ngxs/store';

import { LoginRedirect } from '../state/auth.actions';
import { AuthState } from '../state/auth.state';

@Injectable({
  providedIn: 'root'
})
export class OnboardingGuard {
  constructor(private store: Store) {}

  canActivate(): boolean {
    const isAuthenticated = this.store.selectSnapshot(
      AuthState.isAuthenticated
    );

    const finishedOnboarding = this.store.selectSnapshot(
      AuthState.finishedOnboarding
    );

    if (!isAuthenticated) {
      this.store.dispatch(new LoginRedirect());
    }

    if (isAuthenticated && finishedOnboarding) {
      this.store.dispatch(new Navigate(['/dashboard']));
      return false;
    }

    return true;
  }
}

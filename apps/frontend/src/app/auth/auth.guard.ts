import { inject } from '@angular/core';
import { CanActivateFn } from '@angular/router';
import { Navigate } from '@ngxs/router-plugin';
import { Store } from '@ngxs/store';

import { LoginRedirect } from '../state/auth.actions';
import { AuthState } from '../state/auth.state';

export const AuthGuard: CanActivateFn = () => {
  const store = inject(Store);

  const isAuthenticated = store.selectSnapshot(AuthState.isAuthenticated);

  const finishedOnboarding = store.selectSnapshot(AuthState.finishedOnboarding);

  if (finishedOnboarding === false) {
    store.dispatch(new Navigate(['/onboarding']));
    return false;
  }

  if (!isAuthenticated) {
    store.dispatch(new LoginRedirect());
    return false;
  }

  return true;
};

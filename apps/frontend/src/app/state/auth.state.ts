import { Injectable } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { JwtHelperService } from '@auth0/angular-jwt';
import { isPlatform } from '@ionic/angular';
import { Navigate } from '@ngxs/router-plugin';
import { Action, Selector, State, StateContext } from '@ngxs/store';
import { catchError, concatMap, of, tap } from 'rxjs';

import type { IUser } from '@api/types';

import { AuthService } from '../services/auth.service';
import { ToastrService } from '../services/toastr.service';
import { UserService } from '../services/user.service';
import * as AuthActions from './auth.actions';
import { CreateStoreSuccess, LoadStoreData } from './store.actions';

const jwtHelper = new JwtHelperService();
export interface AuthStateModel {
  user: IUser | null;
  accessToken: string | null;
  refreshToken: string | null;
  loginEmail: string;
  isDesktop: boolean;
  isLoading: boolean;
  returnUrl: string | null;
}

const DEFAULT_AUTH_STATE: AuthStateModel = {
  user: null,
  accessToken: null,
  refreshToken: null,
  loginEmail: '',
  isDesktop: isPlatform('desktop'),
  isLoading: false,
  returnUrl: null
};

@State<AuthStateModel>({
  name: 'auth',
  defaults: DEFAULT_AUTH_STATE
})
@Injectable()
export class AuthState {
  private refreshTokenTimeout?: NodeJS.Timeout;

  @Selector()
  static isAuthenticated(state: AuthStateModel): boolean {
    if (!state.refreshToken) {
      return false;
    }

    const isExpired = jwtHelper.isTokenExpired(state.refreshToken);

    return !isExpired;
  }

  @Selector()
  static isDesktop(state: AuthStateModel): boolean {
    return state.isDesktop;
  }

  @Selector()
  static user(state: AuthStateModel): IUser | null {
    return state.user;
  }

  @Selector()
  static finishedOnboarding(state: AuthStateModel): boolean | null {
    return state.user?.finishedOnboarding ?? null;
  }

  @Selector()
  static accessToken(state: AuthStateModel): string | null {
    return state.accessToken;
  }

  @Selector()
  static refreshToken(state: AuthStateModel): string | null {
    return state.refreshToken;
  }

  @Selector()
  static isLoading(state: AuthStateModel): boolean {
    return state.isLoading;
  }

  constructor(
    private authService: AuthService,
    private userService: UserService,
    private toast: ToastrService,
    private router: Router,
    private route: ActivatedRoute
  ) {}

  @Action(AuthActions.Init)
  init(context: StateContext<AuthStateModel>) {
    context.patchState({
      isDesktop: isPlatform('desktop'),
      returnUrl: null
    });

    if (AuthState.isAuthenticated(context.getState())) {
      context.dispatch(new AuthActions.LoginSuccess());
    } else if (
      !location.pathname.startsWith('/auth') &&
      !location.pathname.startsWith('/onboarding')
    ) {
      context.dispatch(new AuthActions.LoginRedirect());
    }
  }

  @Action(AuthActions.StartTokenRefreshTimer)
  onStartTokenRefresh(context: StateContext<AuthStateModel>) {
    const state = context.getState();
    const token = state.accessToken;

    if (!token) {
      return;
    }

    const decodedToken = jwtHelper.decodeToken(token);
    const expiresAt = decodedToken.exp * 1000;

    const refreshTimeout = expiresAt - Date.now() - 10_000;

    this.refreshTokenTimeout = setTimeout(() => {
      context.dispatch(new AuthActions.RefreshToken());
    }, refreshTimeout);
  }

  @Action(AuthActions.SetRedirectUrl)
  onSetRedirectUrl(
    context: StateContext<AuthStateModel>,
    action: AuthActions.SetRedirectUrl
  ) {
    context.patchState({
      returnUrl: action.returnUrl
    });
  }

  @Action(AuthActions.LoginRedirect)
  onLoginRedirect(context: StateContext<AuthStateModel>) {
    context.dispatch(new Navigate(['auth', 'login']));
  }

  @Action(AuthActions.Login)
  login(context: StateContext<AuthStateModel>, { payload }: AuthActions.Login) {
    context.patchState({
      isLoading: true
    });

    return this.authService.login(payload).pipe(
      tap((jwt) => {
        context.patchState({
          ...jwt
        });
        context.dispatch(new AuthActions.LoginSuccess());
      }),
      catchError((error) =>
        context.dispatch(new AuthActions.LoginFailed(error))
      )
    );
  }

  @Action([AuthActions.LoginSuccess])
  onLoginSuccess(context: StateContext<AuthStateModel>) {
    const state = context.getState();

    const returnUrl = state.returnUrl;

    return this.userService.me().pipe(
      tap((user) => {
        context.patchState({
          user,
          loginEmail: '',
          isDesktop: isPlatform('desktop'),
          isLoading: false,
          returnUrl: null
        });

        context.dispatch([new AuthActions.StartTokenRefreshTimer()]);

        if (returnUrl) {
          context.dispatch(new Navigate([returnUrl]));
        }

        context.dispatch(new LoadStoreData());
      }),
      catchError(() => {
        return context
          .dispatch(new AuthActions.ResetState())
          .pipe(
            concatMap(() => context.dispatch(new AuthActions.LoginRedirect()))
          );
      })
    );
  }

  @Action(AuthActions.Logout)
  logout(context: StateContext<AuthStateModel>) {
    context.patchState({
      returnUrl: this.router.url
    });

    const state = context.getState();

    if (state.refreshToken) {
      return this.authService.logout(state.refreshToken).pipe(
        tap(() => {
          this.stopRefreshTokenTimer();
          context.dispatch(new AuthActions.LogoutSuccess());
        })
      );
    }

    return context.dispatch(new AuthActions.LogoutFailed('No refresh token'));
  }

  @Action([AuthActions.RefreshToken])
  refreshToken(context: StateContext<AuthStateModel>) {
    const state = context.getState();

    if (state.refreshToken) {
      return this.authService.refreshToken().pipe(
        tap((jwt) => {
          context.patchState({
            ...jwt
          });
          context.dispatch(new AuthActions.StartTokenRefreshTimer());
        }),
        catchError((error) =>
          context.dispatch(new AuthActions.LoginFailed(error))
        )
      );
    }

    return of(null);
  }

  @Action(AuthActions.Signup)
  signup(context: StateContext<AuthStateModel>, action: AuthActions.Signup) {
    context.patchState({
      isLoading: true
    });

    return this.authService.signup(action.payload).pipe(
      tap((jwt) => {
        context.patchState(jwt);
        context.dispatch(new AuthActions.SignupSuccess(jwt));
      }),
      catchError((error) =>
        context.dispatch(new AuthActions.SignupFailed(error))
      )
    );
  }

  @Action([AuthActions.SignupSuccess])
  onSignUpSuccess(context: StateContext<AuthStateModel>) {
    console.log('onSignupSuccess, navigating to /onboarding');

    return this.userService.me().pipe(
      tap((user) => {
        context.patchState({
          user,
          isLoading: false
        });

        context.dispatch(new Navigate(['onboarding']));
      })
    );
  }

  @Action([AuthActions.LoginFailed, AuthActions.LogoutSuccess])
  setUserStateOnFailure(context: StateContext<AuthStateModel>) {
    context.dispatch([
      new AuthActions.ResetState(),
      new AuthActions.LoginRedirect()
    ]);
  }

  @Action([AuthActions.UpdateUser])
  updateUser(
    context: StateContext<AuthStateModel>,
    action: AuthActions.UpdateUser
  ) {
    return this.userService.updateUser(action.payload).pipe(
      tap((user) => {
        context.patchState({
          user
        });

        context.dispatch(new AuthActions.UpdateUserSuccess());
      }),
      catchError((error) =>
        context.dispatch(new AuthActions.UpdateUserFailed(error))
      )
    );
  }

  @Action([AuthActions.UpdateUserSuccess])
  updateUserSuccess(context: StateContext<AuthStateModel>) {
    const user = context.getState().user;

    if (!user?.finishedOnboarding && user?.currentOnboardingStep === 1) {
      return this.authService.advanceOnBoarding().pipe(
        tap((user) => {
          context.patchState({
            user
          });
        }),
        catchError(() =>
          this.toast.dangerToast({
            header: '',
            text: 'Could not advance onboarding, please try again later'
          })
        )
      );
    }

    this.toast.successToast({
      header: 'Success',
      text: 'Your profile has been updated'
    });

    return of(null);
  }

  @Action(CreateStoreSuccess)
  createStoreSuccess(context: StateContext<AuthStateModel>) {
    const user = context.getState().user;

    if (!user?.finishedOnboarding && user?.currentOnboardingStep === 2) {
      return this.authService.advanceOnBoarding().pipe(
        tap((user) => {
          context.patchState({
            user
          });
        }),
        catchError(() =>
          this.toast.dangerToast({
            header: '',
            text: 'Could not advance onboarding, please try again later'
          })
        )
      );
    }

    return of(null);
  }

  @Action([AuthActions.CompleteOnboarding])
  completeOnboarding(context: StateContext<AuthStateModel>) {
    return this.authService.completeOnboarding().pipe(
      tap(() => {
        context.dispatch(new AuthActions.CompleteOnboardingSuccess());
      }),

      catchError((error) =>
        context.dispatch(new AuthActions.CompleteOnboardingFailed(error))
      )
    );
  }

  @Action([AuthActions.CompleteOnboardingSuccess])
  onboardingSuccess(context: StateContext<AuthStateModel>) {
    console.log('completed onboarding, navigating to /dashboard');

    return this.userService.me().pipe(
      tap((user) => {
        context.patchState({
          user,
          isLoading: false
        });

        context.dispatch(new Navigate(['dashboard']));
      })
    );
  }

  @Action(AuthActions.ResetPassword)
  resetPassword(
    context: StateContext<AuthStateModel>,
    action: AuthActions.ResetPassword
  ) {
    return this.authService.resetPassword(action.payload).pipe(
      tap(() => {
        context.dispatch(new AuthActions.ResetPasswordSuccess());
      }),
      catchError((error) =>
        context.dispatch(new AuthActions.ResetPasswordFailed(error))
      )
    );
  }

  @Action([AuthActions.ResetPasswordSuccess])
  resetPasswordSuccess() {
    this.toast.successToast({
      header: 'Success',
      text: 'A password reset link has been sent to your email address.'
    });
    this.router.navigate([], {
      relativeTo: this.route,
      queryParams: { success: true },
      queryParamsHandling: 'merge'
    });
  }

  @Action(AuthActions.ResetPasswordFailed)
  resetPasswordFailed() {
    this.toast.dangerToast({
      header: 'Error',
      text: 'Could not reset password, please try again later.'
    });
    this.router.navigate([], {
      relativeTo: this.route,
      queryParams: { success: false },
      queryParamsHandling: 'merge'
    });
  }

  @Action([AuthActions.NewPassword])
  newPassword(
    context: StateContext<AuthStateModel>,
    action: AuthActions.NewPassword
  ) {
    return this.authService.newPassword(action.payload).pipe(
      tap(() => {
        context.dispatch(new AuthActions.NewPasswordSuccess());
      }),
      catchError((error) =>
        context.dispatch(new AuthActions.NewPasswordFailed(error))
      )
    );
  }

  @Action([AuthActions.NewPasswordSuccess])
  newPasswordSuccess(context: StateContext<AuthStateModel>) {
    this.toast.successToast({
      header: 'Success',
      text: 'Your password has been updated'
    });
    context.dispatch(new Navigate(['auth', 'login']));
  }

  @Action([AuthActions.ResetState])
  onResetState(context: StateContext<AuthStateModel>) {
    this.stopRefreshTokenTimer();
    context.patchState({
      ...DEFAULT_AUTH_STATE,
      returnUrl: context.getState().returnUrl
    });
  }

  @Action([
    AuthActions.CompleteOnboardingFailed,
    AuthActions.UpdateUserFailed,
    AuthActions.SignupFailed,
    AuthActions.LoginFailed,
    AuthActions.NewPasswordFailed,
    AuthActions.ResetPasswordFailed,
    AuthActions.LogoutFailed
  ])
  onFailure(
    _: StateContext<AuthStateModel>,
    action: AuthActions.CompleteOnboardingFailed
  ) {
    if (action.error) {
      this.toast.dangerToast({
        header: '',
        text: action.error
      });
    }
  }

  private stopRefreshTokenTimer() {
    clearTimeout(this.refreshTokenTimeout);
  }
}

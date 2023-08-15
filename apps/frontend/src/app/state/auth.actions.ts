import type {
  IJwt,
  ILoginDto,
  INewPassword,
  IResetPassword,
  IUserCreateDto,
  IUserUpdateDto
} from '@api/types';

export class Init {
  static readonly type = '[Auth] Init';
}

export class ResetState {
  static readonly type = '[APP] reset state';
}

export class Login {
  static readonly type = '[Auth] Log user in';
  constructor(public payload: ILoginDto) {}
}

export class LoginRedirect {
  static readonly type = '[Auth] Login Redirect';
}

export class LoginSuccess {
  static readonly type = '[Auth] Login Success';
}
export class LoginFailed {
  static readonly type = '[Auth] Login Failed';
  constructor(public error: string) {}
}

export class LoginGoogle {
  static readonly type = '[Auth] Log user in with Google';
}

export class Signup {
  static readonly type = '[Auth] Sign user up';
  constructor(public payload: IUserCreateDto) {}
}

export class SignupSuccess {
  static readonly type = '[Auth] Sign user up Success';
  constructor(public payload: IJwt) {}
}

export class SignupFailed {
  static readonly type = '[Auth] Sign user up failed';
  constructor(public error: string) {}
}

export class ResetPassword {
  static readonly type = '[Auth] Reset user password';
  constructor(public payload: IResetPassword) {}
}

export class ResetPasswordSuccess {
  static readonly type = '[Auth] Reset user password Success';
}

export class ResetPasswordFailed {
  static readonly type = '[Auth] Reset user password Failed';
  constructor(public error: string) {}
}

export class NewPassword {
  static readonly type = '[Auth] New user password';
  constructor(public payload: INewPassword) {}
}

export class NewPasswordSuccess {
  static readonly type = '[Auth] New user password Success';
}

export class NewPasswordFailed {
  static readonly type = '[Auth] New user password Failed';
  constructor(public error: string) {}
}

export class Logout {
  static readonly type = '[Auth] Log user out';
}

export class LogoutSuccess {
  static readonly type = '[Auth] Logout Success';
}

export class LogoutFailed {
  static readonly type = '[Auth] Logout Failed';
  constructor(public error: string) {}
}

export class RefreshToken {
  static readonly type = '[Auth] Refresh Token';
}

export class UpdateUser {
  static readonly type = '[Auth] Update User';
  constructor(public payload: IUserUpdateDto) {}
}

export class UpdateUserSuccess {
  static readonly type = '[Auth] Update User Success';
}

export class UpdateUserFailed {
  static readonly type = '[Auth] Update User Failed';
  constructor(public error: string) {}
}

export class CompleteOnboarding {
  static readonly type = '[Auth] Complete Onboarding';
}

export class CompleteOnboardingSuccess {
  static readonly type = '[Auth] Complete Onboarding Success';
}

export class CompleteOnboardingFailed {
  static readonly type = '[Auth] Complete Onboarding Failed';
  constructor(public error: string) {}
}

export class StartTokenRefreshTimer {
  static readonly type = '[Auth] Start Token Refresh Timer';
}

export class SetRedirectUrl {
  static readonly type = '[Auth] Set Redirect Url';
  constructor(public returnUrl: string) {}
}

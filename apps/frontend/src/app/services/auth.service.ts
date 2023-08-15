import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { from, Observable, of, switchMap } from 'rxjs';
import { catchError, map } from 'rxjs/operators';

import type {
  IJwt,
  ILoginDto,
  ILogoutDto,
  INewPassword,
  IResetPassword,
  IUser,
  IUserCreateDto
} from '@api/types';

import { sha1 } from '../shared/utils';

@Injectable({
  providedIn: 'root'
})
export class AuthService {
  private readonly apiURL = process.env['NX_API_URL'];

  constructor(private http: HttpClient) {}

  login(payload: ILoginDto) {
    return this.http.post<IJwt>(this.apiURL + '/auth/login', payload);
  }

  signup(payload: IUserCreateDto) {
    return this.http.post<IJwt>(this.apiURL + '/auth/signup', payload);
  }

  logout(refreshToken: string) {
    const payload: ILogoutDto = {
      refreshToken
    };

    return this.http.post<boolean>(this.apiURL + '/auth/logout', payload);
  }

  refreshToken() {
    return this.http.get<IJwt>(this.apiURL + '/auth/refresh');
  }

  resetPassword(payload: IResetPassword) {
    return this.http.post<IUser>(this.apiURL + '/auth/reset', payload);
  }

  newPassword(payload: INewPassword) {
    return this.http.post<IUser>(this.apiURL + '/auth/renew', payload);
  }

  completeOnboarding() {
    return this.http.post<boolean>(
      this.apiURL + '/auth/complete-onboarding',
      null
    );
  }

  advanceOnBoarding() {
    return this.http.post<IUser>(
      this.apiURL + '/auth/advance-onboarding',
      null
    );
  }

  isPasswordPwned(password: string): Observable<boolean> {
    if (!window.crypto.subtle) {
      console.log('Web Crypto API not supported. Skipping password check.');
      return of(false);
    }

    return from(sha1(password).then((hash) => hash.toUpperCase())).pipe(
      switchMap((pwHash) =>
        this.http
          .get<string>(
            `https://api.pwnedpasswords.com/range/${pwHash.slice(0, 5)}`,
            {
              headers: {
                Accept: 'text/plain'
              }
            }
          )
          .pipe(
            map((response) => response.split('\r\n')),
            map((possibleHashes) => {
              return possibleHashes.some((possibleHash) => {
                const [hash] = possibleHash.split(':');
                return pwHash.includes(hash);
              });
            }),
            catchError(() => {
              return of(false);
            })
          )
      )
    );
  }
}

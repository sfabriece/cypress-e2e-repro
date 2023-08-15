import {
  HttpEvent,
  HttpHandler,
  HttpInterceptor,
  HttpRequest
} from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Store } from '@ngxs/store';
import { Observable } from 'rxjs';

import { AuthState } from '../state/auth.state';

const getHeaders = (url: string, token: string) => {
  const settings = {
    setHeaders: {
      Authorization: `Bearer ${token}`
    }
  };

  if (!url.includes('upload-receipts')) {
    return {
      ...settings,
      setHeaders: {
        ...settings.setHeaders,
        'Content-Type': 'application/json'
      }
    };
  }

  return settings;
};

@Injectable()
export class AuthInterceptor implements HttpInterceptor {
  constructor(private readonly store: Store) {}

  intercept(
    request: HttpRequest<unknown>,
    next: HttpHandler
  ): Observable<HttpEvent<unknown>> {
    const accessToken = this.store.selectSnapshot(AuthState.accessToken);
    const refreshToken = this.store.selectSnapshot(AuthState.refreshToken);
    const isAuthenticated = this.store.selectSnapshot(
      AuthState.isAuthenticated
    );

    if (!isAuthenticated) {
      return next.handle(request);
    }

    if (request.url.includes('/auth/refresh')) {
      request = request.clone(getHeaders(request.url, refreshToken!));

      return next.handle(request);
    }

    request = request.clone(getHeaders(request.url, accessToken!));

    return next.handle(request);
  }
}

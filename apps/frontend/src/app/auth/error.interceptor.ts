import {
  HttpErrorResponse,
  HttpEvent,
  HttpHandler,
  HttpInterceptor,
  HttpRequest
} from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Store } from '@ngxs/store';
import { Observable, throwError } from 'rxjs';
import { catchError } from 'rxjs/operators';

import { AuthState } from '../state/auth.state';
import { ToastrService } from './../services/toastr.service';
import { Logout } from './../state/auth.actions';

@Injectable()
export class ErrorInterceptor implements HttpInterceptor {
  constructor(
    private readonly store: Store,
    private readonly toast: ToastrService
  ) {}

  intercept(
    request: HttpRequest<unknown>,
    next: HttpHandler
  ): Observable<HttpEvent<unknown>> {
    const isAuthenticated = this.store.selectSnapshot(
      AuthState.isAuthenticated
    );

    return next.handle(request).pipe(
      catchError((error) => {
        let errorMessage = '';

        if (error instanceof HttpErrorResponse) {
          if (error.error instanceof ErrorEvent) {
            // client-side error
            // errorMessage = `Error Code: ${error.status}\nMessage: ${error.message}`;
            console.log(
              'client-side error:',
              `${error.status}\nMessage: ${error.message}`
            );
            errorMessage = error.message;
          } else {
            // server-side error
            errorMessage =
              error.status === 409
                ? 'Eksisterer allerede'
                : (error && error.error && error.error.message) ||
                  error.statusText;
          }
        } else {
          console.error('some thing else happened');
        }

        if ([401, 403].includes(error.status) && isAuthenticated) {
          // auto logout if 401 or 403 response returned from api
          this.toast.persistentWarnToast({
            text: 'Din økt har utløpt. Vennligst logg inn igjen.'
          });
          this.store.dispatch(new Logout());
        }

        console.error(errorMessage);
        return throwError(() => errorMessage);
      })
    );
  }
}

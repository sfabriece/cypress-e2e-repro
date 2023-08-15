import {
  AbstractControl,
  AsyncValidatorFn,
  ValidationErrors
} from '@angular/forms';
import { map, Observable } from 'rxjs';

import { AuthService } from '../../services/auth.service';

export const AuthValidator = {
  createIsPwnedValidator(authService: AuthService): AsyncValidatorFn {
    return (control: AbstractControl): Observable<ValidationErrors | null> => {
      return authService
        .isPasswordPwned(control.value)
        .pipe(map((result: boolean) => (result ? { pwned: true } : null)));
    };
  }
};

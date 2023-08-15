import { NgIf } from '@angular/common';
import { Component } from '@angular/core';
import {
  FormControl,
  FormGroup,
  FormsModule,
  ReactiveFormsModule,
  Validators
} from '@angular/forms';
import { RouterLink } from '@angular/router';
import { IonicModule } from '@ionic/angular';
import { Store } from '@ngxs/store';

import type { IUserCreateDto } from '@api/types';

import { AuthService } from '../../../services/auth.service';
import { Signup } from '../../../state/auth.actions';
import { passwordMaxLength, passwordMinLength } from '../../auth.constants';
import { AuthValidator } from '../../validators/auth.validator';
import { PasswordStrengthComponent } from '../password-strength/password-strength.component';

@Component({
  selector: 'innut-signup-form',
  templateUrl: './signup-form.component.html',
  styleUrls: ['./signup-form.component.scss'],
  standalone: true,
  imports: [
    FormsModule,
    ReactiveFormsModule,
    NgIf,
    PasswordStrengthComponent,
    IonicModule,
    RouterLink
  ]
})
export class SignupFormComponent {
  signupForm = new FormGroup({
    email: new FormControl('', [Validators.email, Validators.required]),
    password: new FormControl(
      '',
      [
        Validators.minLength(passwordMinLength),
        Validators.maxLength(passwordMaxLength),
        Validators.required
      ],
      [AuthValidator.createIsPwnedValidator(this.authService)]
    ),
    confirm: new FormControl('', [
      Validators.minLength(passwordMinLength),
      Validators.maxLength(passwordMaxLength),
      Validators.required
    ])
  });

  formSubmitted = false;
  pwConfirmError = false;

  constructor(
    private store: Store,
    private authService: AuthService
  ) {}

  submit() {
    this.formSubmitted = true;

    if (this.signupForm.valid && !this.pwConfirmError) {
      const payload: IUserCreateDto = {
        email: this.signupForm.value.email || '',
        password: this.signupForm.value.password || ''
      };

      this.store.dispatch(new Signup(payload));
    }
  }

  pwMatch() {
    const password = this.signupForm.get('password')?.value;
    const confirm = this.signupForm.get('confirm')?.value;
    return (this.pwConfirmError = password === confirm ? false : true);
  }
}

import { NgIf } from '@angular/common';
import { AfterViewInit, Component, ElementRef, ViewChild } from '@angular/core';
import {
  FormControl,
  FormGroup,
  FormsModule,
  ReactiveFormsModule,
  Validators
} from '@angular/forms';
import { Router, RouterLink } from '@angular/router';
import { IonicModule } from '@ionic/angular';
import { Store } from '@ngxs/store';
import { tap } from 'rxjs';

import { ILoginDto } from '@api/types';

import { Login, LoginGoogle } from '../../../state/auth.actions';
import { passwordMaxLength, passwordMinLength } from '../../auth.constants';

@Component({
  selector: 'innut-login-form',
  templateUrl: './login-form.component.html',
  styleUrls: ['./login-form.component.scss'],
  standalone: true,
  imports: [FormsModule, ReactiveFormsModule, NgIf, IonicModule, RouterLink]
})
export class LoginFormComponent implements AfterViewInit {
  loginForm = new FormGroup({
    email: new FormControl('', [Validators.email, Validators.required]),
    password: new FormControl('', [
      Validators.minLength(passwordMinLength),
      Validators.maxLength(passwordMaxLength),
      Validators.required
    ]),
    remember: new FormControl(false)
  });

  formSubmitted = false;

  @ViewChild('passwordfield') passwordField: ElementRef;

  constructor(
    private store: Store,
    private router: Router
  ) {}

  ngAfterViewInit(): void {
    this.store
      .selectOnce((state) => state.auth.loginEmail)
      .pipe(
        tap((email) => {
          if (email) {
            this.loginForm.get('email')?.setValue(email);
            this.passwordField.nativeElement.focus();
          }
        })
      )
      .subscribe();
  }

  login() {
    this.formSubmitted = true;
    if (this.loginForm.valid) {
      const payload: ILoginDto = {
        email: this.loginForm.value.email || '',
        password: this.loginForm.value.password || ''
      };

      this.store.dispatch(new Login(payload));
    }
  }

  loginGoogle() {
    this.store.dispatch(new LoginGoogle());
  }

  forgotTrigger() {
    this.router.navigate(['auth', 'reset']);
  }
}

import { CommonModule } from '@angular/common';
import { NgModule } from '@angular/core';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { IonicModule } from '@ionic/angular';

import { AuthPageRoutingModule } from './auth-routing.module';
import { AuthPage } from './auth.page';
import { LoginFormComponent } from './components/login-form/login-form.component';
import { PasswordStrengthComponent } from './components/password-strength/password-strength.component';
import { SignupFormComponent } from './components/signup-form/signup-form.component';

@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    ReactiveFormsModule,
    IonicModule,
    AuthPageRoutingModule,
    AuthPage,
    LoginFormComponent,
    SignupFormComponent,
    PasswordStrengthComponent
  ]
})
export class AuthPageModule {}

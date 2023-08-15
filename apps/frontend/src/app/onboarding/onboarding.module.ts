import { CommonModule } from '@angular/common';
import { NgModule } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { IonicModule } from '@ionic/angular';

import { SettingsPageModule } from '../settings/settings.module';
import { OnboardingPageRoutingModule } from './onboarding-routing.module';
import { OnboardingPage } from './onboarding.page';
import { StepIndicatorComponent } from './step-indicator/step-indicator.component';

@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    IonicModule,
    OnboardingPageRoutingModule,
    SettingsPageModule,
    OnboardingPage,
    StepIndicatorComponent
  ]
})
export class OnboardingPageModule {}

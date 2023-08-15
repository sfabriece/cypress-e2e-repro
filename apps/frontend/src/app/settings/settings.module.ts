import { CommonModule } from '@angular/common';
import { NgModule } from '@angular/core';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { IonicModule } from '@ionic/angular';

import { SharedModule } from '../shared/shared.module';
import { StoreFormComponent } from './components/store-form/store-form.component';
import { UserFormComponent } from './components/user-form/user-form.component';
import { SettingsPageRoutingModule } from './settings-routing.module';
import { SettingsPage } from './settings.page';
import { StoreSettingsComponent } from './sub-pages/store-settings/store-settings.component';

@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    ReactiveFormsModule,
    IonicModule,
    SettingsPageRoutingModule,
    SharedModule,
    SettingsPage,
    StoreSettingsComponent,
    StoreFormComponent,
    UserFormComponent
  ],
  exports: [StoreFormComponent, UserFormComponent]
})
export class SettingsPageModule {}

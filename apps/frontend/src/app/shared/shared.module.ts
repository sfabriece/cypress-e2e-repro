import { ClipboardModule } from '@angular/cdk/clipboard';
import { CommonModule } from '@angular/common';
import { NgModule } from '@angular/core';
import { RouterModule } from '@angular/router';
import { IonicModule } from '@ionic/angular';

import { BadgeComponent } from './components/badge.component';
import { PetListComponent } from './components/pet-list/pet-list.component';
import { SideNavComponent } from './components/side-nav/side-nav.component';
import { ErrorPage } from './error-page/error.page';

const COMPONENTS = [
  BadgeComponent,
  PetListComponent,
  SideNavComponent,
  ErrorPage
];

const MODULES = [CommonModule, ClipboardModule, IonicModule, RouterModule];

@NgModule({
  imports: [...MODULES, ...COMPONENTS],
  exports: [...COMPONENTS]
})
export class SharedModule {}

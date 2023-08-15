import { CommonModule } from '@angular/common';
import { NgModule } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { IonicModule } from '@ionic/angular';

import { SharedModule } from '../shared/shared.module';
import { PetViewerPageRoutingModule } from './pet-viewer-routing.module';
import { PetViewerPage } from './pet-viewer.page';

@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    IonicModule,
    PetViewerPageRoutingModule,
    SharedModule,
    PetViewerPage
  ]
})
export class PetViewerPageModule {}

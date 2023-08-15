import { CommonModule } from '@angular/common';
import { NgModule } from '@angular/core';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { IonicModule } from '@ionic/angular';

import { SharedModule } from '../shared/shared.module';
import { PetsPageRoutingModule } from './pets-routing.module';
import { PetsPage } from './pets.page';
import { PetComponent } from './sub-pages/pet/pet.component';
import { PetsComponent } from './sub-pages/pets/pets.component';
import { SubmittedPetComponent } from './sub-pages/submitted-pet/submitted-pet.component';

@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    ReactiveFormsModule,
    IonicModule,
    PetsPageRoutingModule,
    SharedModule,
    PetsPage,
    PetComponent,
    PetsComponent,
    SubmittedPetComponent
  ]
})
export class PetsPageModule {}

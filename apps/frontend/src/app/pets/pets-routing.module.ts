import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';

import { NotFoundGuard } from './not-found.guard';
import { PetsPage } from './pets.page';
import { PetComponent } from './sub-pages/pet/pet.component';
import { PetsComponent } from './sub-pages/pets/pets.component';
import { SubmittedPetComponent } from './sub-pages/submitted-pet/submitted-pet.component';

const routes: Routes = [
  {
    path: '',
    component: PetsPage,

    children: [
      {
        path: '',
        component: PetsComponent
      },
      {
        path: 'submitted/:id',
        component: SubmittedPetComponent,
        canActivate: [NotFoundGuard],
        data: { title: 'Pet', color: 'primary' }
      },
      {
        path: 'new',
        component: PetComponent,
        data: { title: 'New Pet', color: 'primary' }
      },
      {
        path: ':id',
        component: PetComponent,
        data: { title: 'Pet', color: 'primary' }
      }
    ]
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class PetsPageRoutingModule {}

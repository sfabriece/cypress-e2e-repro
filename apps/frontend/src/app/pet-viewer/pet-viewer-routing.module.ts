import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';

import { PetViewerPage } from './pet-viewer.page';

const routes: Routes = [
  {
    path: '',
    component: PetViewerPage
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class PetViewerPageRoutingModule {}

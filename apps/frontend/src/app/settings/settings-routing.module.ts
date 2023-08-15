import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';

import { SettingsPage } from './settings.page';
import { StoreSettingsComponent } from './sub-pages/store-settings/store-settings.component';

const routes: Routes = [
  {
    path: '',
    component: SettingsPage,
    children: [
      {
        path: '',
        redirectTo: 'store',
        pathMatch: 'full'
      },
      {
        path: 'store',
        component: StoreSettingsComponent,
        data: { title: 'General', color: 'primary' }
      }
    ]
  },
  { path: '', redirectTo: 'store', pathMatch: 'full' }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class SettingsPageRoutingModule {}

import { NgModule } from '@angular/core';
import { PreloadAllModules, RouterModule, Routes } from '@angular/router';

import { AuthGuard } from './auth/auth.guard';
import { OnboardingGuard } from './auth/onboarding.guard';
import { ErrorPage } from './shared/error-page/error.page';

const routes: Routes = [
  {
    path: '',
    redirectTo: 'dashboard',
    pathMatch: 'full'
  },
  {
    path: 'auth',
    loadChildren: () =>
      import('./auth/auth.module').then((m) => m.AuthPageModule),
    data: { title: 'Sign In', color: 'primary' }
  },
  {
    path: 'pet-viewer/:id',
    loadChildren: () =>
      import('./pet-viewer/pet-viewer.module').then(
        (m) => m.PetViewerPageModule
      ),
    data: { title: 'Pets', color: 'primary' }
  },
  {
    path: 'onboarding',
    canActivate: [OnboardingGuard],
    loadChildren: () =>
      import('./onboarding/onboarding.module').then(
        (m) => m.OnboardingPageModule
      ),
    data: { title: 'Welcome', color: 'primary' }
  },
  {
    path: 'dashboard',
    canActivate: [AuthGuard],
    loadChildren: () =>
      import('./dashboard/dashboard.module').then((m) => m.DashboardPageModule),
    data: { title: 'Dashboard', color: 'primary' }
  },
  {
    path: 'pets',
    canActivate: [AuthGuard],
    loadChildren: () =>
      import('./pets/pets.module').then((m) => m.PetsPageModule),
    data: { title: 'pets', color: 'primary' }
  },
  {
    path: 'settings',
    canActivate: [AuthGuard],
    loadChildren: () =>
      import('./settings/settings.module').then((m) => m.SettingsPageModule),
    data: { title: 'Settings', color: 'primary' }
  },
  { path: '**', component: ErrorPage }
];

@NgModule({
  imports: [
    RouterModule.forRoot(routes, { preloadingStrategy: PreloadAllModules })
  ],
  exports: [RouterModule]
})
export class AppRoutingModule {}

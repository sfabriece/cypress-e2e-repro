import { LayoutModule } from '@angular/cdk/layout';
import {
  HTTP_INTERCEPTORS,
  provideHttpClient,
  withInterceptorsFromDi
} from '@angular/common/http';
import { enableProdMode, importProvidersFrom } from '@angular/core';
import { bootstrapApplication, BrowserModule } from '@angular/platform-browser';
import { provideAnimations } from '@angular/platform-browser/animations';
import { RouteReuseStrategy } from '@angular/router';
import { IonicModule, IonicRouteStrategy, isPlatform } from '@ionic/angular';
import { defineCustomElements } from '@ionic/pwa-elements/loader';
import { NgxsReduxDevtoolsPluginModule } from '@ngxs/devtools-plugin';
import { NgxsRouterPluginModule } from '@ngxs/router-plugin';
import { NgxsStoragePluginModule } from '@ngxs/storage-plugin';
import { NgxsModule } from '@ngxs/store';

import { AppRoutingModule } from './app/app-routing.module';
import { AppComponent } from './app/app.component';
import { AuthInterceptor } from './app/auth/auth.interceptor';
import { ErrorInterceptor } from './app/auth/error.interceptor';
import { SharedModule } from './app/shared/shared.module';
import { AuthState } from './app/state/auth.state';
import { PetsState } from './app/state/pets.state';
import { StoreState } from './app/state/store.state';
import { environment } from './environments/environment';

if (environment.production) {
  enableProdMode();
}

bootstrapApplication(AppComponent, {
  providers: [
    importProvidersFrom(
      BrowserModule,
      IonicModule.forRoot({
        swipeBackEnabled: true,
        mode: 'ios',
        animated: !isPlatform('desktop')
      }),
      AppRoutingModule,
      NgxsModule.forRoot([PetsState, AuthState, StoreState], {
        developmentMode: !environment.production
      }),
      NgxsReduxDevtoolsPluginModule.forRoot(),
      NgxsStoragePluginModule.forRoot({
        key: ['auth.user', 'auth.accessToken', 'auth.refreshToken']
      }),
      NgxsRouterPluginModule.forRoot(),
      SharedModule,
      LayoutModule
    ),
    { provide: RouteReuseStrategy, useClass: IonicRouteStrategy },
    { provide: HTTP_INTERCEPTORS, useClass: AuthInterceptor, multi: true },
    { provide: HTTP_INTERCEPTORS, useClass: ErrorInterceptor, multi: true },

    provideAnimations(),
    provideHttpClient(withInterceptorsFromDi())
  ]
}).catch((error) => console.error(error));

defineCustomElements(window);

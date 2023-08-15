import { BreakpointObserver } from '@angular/cdk/layout';
import { AsyncPipe, NgIf, registerLocaleData } from '@angular/common';
import localeNo from '@angular/common/locales/no';
import { Component, OnInit } from '@angular/core';
import { Title } from '@angular/platform-browser';
import {
  ActivatedRoute,
  NavigationEnd,
  Router,
  RouterLink
} from '@angular/router';
import { IonicModule, MenuController } from '@ionic/angular';
import { Store } from '@ngxs/store';
import { distinctUntilChanged, filter, map, tap } from 'rxjs';

import { SideNavComponent } from './shared/components/side-nav/side-nav.component';
import { Init, Logout } from './state/auth.actions';
import { AuthState } from './state/auth.state';

registerLocaleData(localeNo, 'no');

@Component({
  selector: 'innut-root',
  templateUrl: 'app.component.html',
  styleUrls: ['app.component.scss'],
  standalone: true,
  imports: [IonicModule, NgIf, RouterLink, SideNavComponent, AsyncPipe]
})
export class AppComponent implements OnInit {
  constructor(
    private store: Store,
    private menu: MenuController,
    private route: Router,
    private activatedRoute: ActivatedRoute,
    private titleService: Title,
    private breakpointObserver: BreakpointObserver
  ) {}

  user$ = this.store.select(AuthState.user);
  isAuthenticated$ = this.store.select(AuthState.isAuthenticated);
  isDesktop$ = this.breakpointObserver.observe(['(min-width: 768px)']).pipe(
    map((result) => result.matches),
    distinctUntilChanged()
  );

  private readonly routeNavigationEnd$ = this.route.events.pipe(
    filter((event): event is NavigationEnd => event instanceof NavigationEnd)
  );

  hideSplitpane$ = this.routeNavigationEnd$.pipe(
    map((event) => {
      const url = event.url ?? '';
      return (
        url.includes('auth') ||
        url.includes('onboarding') ||
        url.includes('pet-viewer')
      );
    })
  );

  isOnboarding$ = this.routeNavigationEnd$.pipe(
    map((event) => {
      return event.url?.includes('onboarding');
    })
  );

  routeData$ = this.routeNavigationEnd$.pipe(
    map(() => {
      let child = this.activatedRoute.firstChild;
      while (child) {
        if (child.firstChild) {
          child = child.firstChild;
        } else if (child.snapshot.data) {
          return child.snapshot.data;
        } else {
          return null;
        }
      }
      return null;
    }),
    tap((data) => {
      this.titleService.setTitle(data?.['title']);
    })
  );

  ngOnInit(): void {
    this.store.dispatch([new Init()]);
    this.menu.enable(true, 'first');
  }

  closeMenu() {
    this.menu.close('first');
  }

  logout() {
    this.store.dispatch([new Logout()]);
  }
}

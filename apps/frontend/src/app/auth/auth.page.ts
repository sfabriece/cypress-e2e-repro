import { Component, OnDestroy, OnInit } from '@angular/core';
import { NavigationEnd, Router, RouterOutlet } from '@angular/router';
import { IonicModule } from '@ionic/angular';
import { Store } from '@ngxs/store';
import { filter, Subscription, tap } from 'rxjs';

import { AuthState } from '../state/auth.state';

@Component({
  selector: 'innut-auth',
  templateUrl: './auth.page.html',
  styleUrls: ['./auth.page.scss'],
  standalone: true,
  imports: [IonicModule, RouterOutlet]
})
export class AuthPage implements OnInit, OnDestroy {
  private subscriptions = new Subscription();
  private urlSubscription = new Subscription();

  route$ = this.router.events.pipe(
    filter((event): event is NavigationEnd => event instanceof NavigationEnd),
    tap((event) => {
      this.setAuthState(event.url);
    })
  );

  isAuthenticated$ = this.store.select(AuthState.isAuthenticated).pipe(
    filter((isAuth) => isAuth),
    tap(() => {
      this.router.navigate(['dashboard']);
    })
  );

  headerText = 'Sign in';

  constructor(
    private router: Router,
    private store: Store
  ) {}

  ngOnInit(): void {
    this.urlSubscription.add(this.route$.subscribe());

    this.setAuthState(this.router.url);
  }

  ionViewWillEnter() {
    this.subscriptions.add(this.isAuthenticated$.subscribe());
  }

  ionViewDidLeave(): void {
    this.subscriptions.unsubscribe();
  }

  ngOnDestroy(): void {
    this.urlSubscription.unsubscribe();
  }

  setAuthState(url: string) {
    if (url.includes('login')) {
      this.headerText = 'Sign in';
    }

    if (url.includes('signup')) {
      this.headerText = 'Create account';
    }

    if (url.includes('reset')) {
      this.headerText = 'Reset password';
    }
  }
}

import { AsyncPipe, NgIf } from '@angular/common';
import { Component } from '@angular/core';
import { RouterLink } from '@angular/router';
import { IonicModule } from '@ionic/angular';
import { Store } from '@ngxs/store';
import { Subscription } from 'rxjs';

import { AuthState } from '../state/auth.state';
import { StoreState } from '../state/store.state';

@Component({
  selector: 'innut-dashboard',
  templateUrl: './dashboard.page.html',
  styleUrls: ['./dashboard.page.scss'],
  standalone: true,
  imports: [IonicModule, NgIf, RouterLink, AsyncPipe]
})
export class DashboardPage {
  user$ = this.store.select(AuthState.user);

  store$ = this.store.select(StoreState.store);

  private subscriptions = new Subscription();

  constructor(private store: Store) {}

  ionViewWillEnter() {}

  ionViewDidEnter() {}

  ionViewDidLeave() {
    this.subscriptions.unsubscribe();
  }
}

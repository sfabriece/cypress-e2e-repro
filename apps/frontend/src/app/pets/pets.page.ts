import { Component } from '@angular/core';
import { IonicModule } from '@ionic/angular';
import { Store } from '@ngxs/store';

import { LoadPets } from '../state/pets.actions';

@Component({
  selector: 'innut-pets',
  template: `<ion-router-outlet></ion-router-outlet>`,
  styles: [],
  standalone: true,
  imports: [IonicModule]
})
export class PetsPage {
  constructor(private store: Store) {}

  ionViewWillEnter() {
    this.store.dispatch(new LoadPets());
  }
}

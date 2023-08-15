import { AsyncPipe, CurrencyPipe, DatePipe, NgIf } from '@angular/common';
import { AfterViewInit, Component } from '@angular/core';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { ActivatedRoute } from '@angular/router';
import { IonicModule } from '@ionic/angular';
import { Store } from '@ngxs/store';
import { Observable } from 'rxjs';

import type { IFullPet } from '@api/types';

import { BadgeComponent } from '../../../shared/components/badge.component';
import { DuplicatePet, LoadFullPet } from '../../../state/pets.actions';

@Component({
  selector: 'innut-submitted-pet',
  templateUrl: './submitted-pet.component.html',
  styleUrls: ['./submitted-pet.component.scss'],
  standalone: true,
  imports: [
    NgIf,
    IonicModule,
    BadgeComponent,
    FormsModule,
    ReactiveFormsModule,
    AsyncPipe,
    CurrencyPipe,
    DatePipe
  ]
})
export class SubmittedPetComponent implements AfterViewInit {
  constructor(
    private readonly route: ActivatedRoute,
    private readonly store: Store
  ) {}

  pet$: Observable<IFullPet | undefined> = this.store.select(
    (state) => state.pets.selectedPet
  );

  formSubmitted = false;

  ngAfterViewInit(): void {
    this.store.dispatch(new LoadFullPet(this.route.snapshot.params['id']));
  }

  openPet(id: string): void {
    window.open(`/pet-viewer/${id}`, '_blank');
  }

  duplicatePet(id: string): void {
    this.store.dispatch(new DuplicatePet(id));
  }
}

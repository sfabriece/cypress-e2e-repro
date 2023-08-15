import { AsyncPipe, NgIf } from '@angular/common';
import { Component } from '@angular/core';
import { FormControl, FormsModule, ReactiveFormsModule } from '@angular/forms';
import { RouterLink } from '@angular/router';
import { IonicModule } from '@ionic/angular';
import { Store } from '@ngxs/store';
import { combineLatest, map, startWith } from 'rxjs';

import { PetListComponent } from '../../../shared/components/pet-list/pet-list.component';
import { PetsState } from '../../../state/pets.state';

@Component({
  selector: 'innut-pets',
  templateUrl: './pets.component.html',
  styleUrls: ['./pets.component.scss'],
  standalone: true,
  imports: [
    IonicModule,
    RouterLink,
    FormsModule,
    ReactiveFormsModule,
    PetListComponent,
    NgIf,
    AsyncPipe
  ]
})
export class PetsComponent {
  constructor(private store: Store) {}

  pets$ = this.store.select(PetsState.selectPets);
  filter = new FormControl('');
  sort = new FormControl('number');

  filter$ = this.filter.valueChanges.pipe(startWith(''));
  filteredPets$ = combineLatest([this.pets$, this.filter$]).pipe(
    map(([pets, filter]) => {
      return pets.filter((pet) => {
        return pet.status.includes(filter || '');
      });
    })
  );
}

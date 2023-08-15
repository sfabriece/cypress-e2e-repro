import { CurrencyPipe, DatePipe, NgFor } from '@angular/common';
import { Component, Input, OnInit } from '@angular/core';
import { RouterLink } from '@angular/router';
import { IonicModule } from '@ionic/angular';

import type { IExtendedPet, IPet } from '@api/types';

import { BadgeComponent } from '../badge.component';

@Component({
  selector: 'innut-pet-list',
  templateUrl: './pet-list.component.html',
  styleUrls: ['./pet-list.component.scss'],
  standalone: true,
  imports: [
    NgFor,
    IonicModule,
    RouterLink,
    BadgeComponent,
    CurrencyPipe,
    DatePipe
  ]
})
export class PetListComponent implements OnInit {
  @Input() pets: IExtendedPet[];

  constructor() {}

  ngOnInit(): void {}

  trackByFn(_index: number, pet: IPet) {
    return pet.id;
  }
}

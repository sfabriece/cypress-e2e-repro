import { Clipboard } from '@angular/cdk/clipboard';
import { AsyncPipe, CurrencyPipe, DatePipe, NgIf } from '@angular/common';
import { Component } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { IonicModule } from '@ionic/angular';
import { Observable } from 'rxjs';

import type { IFullPet } from '@api/types';

import { PetsService } from '../services/pets.service';
import { ToastrService } from '../services/toastr.service';

@Component({
  selector: 'innut-pet-viewer',
  templateUrl: './pet-viewer.page.html',
  styleUrls: ['./pet-viewer.page.scss'],
  standalone: true,
  imports: [NgIf, IonicModule, AsyncPipe, CurrencyPipe, DatePipe]
})
export class PetViewerPage {
  pet$: Observable<IFullPet | undefined>;

  constructor(
    private clipboard: Clipboard,
    private toast: ToastrService,
    private petService: PetsService,
    private route: ActivatedRoute
  ) {}

  ionViewWillEnter() {
    this.pet$ = this.petService.getFullPet(this.route.snapshot.params['id']);
  }

  copyToClipboard(text?: string | number | Date | null): void {
    if (!text) {
      this.toast.warningToast({
        header: 'Warning',
        text: 'No text'
      });
      return;
    }

    this.clipboard.copy(text.toString());
    this.toast.successToast({
      header: 'Success',
      text: 'Copy to clipboard'
    });
  }
}

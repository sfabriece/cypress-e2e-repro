import { AsyncPipe, CurrencyPipe, NgFor, NgIf } from '@angular/common';
import { AfterViewInit, Component, OnDestroy } from '@angular/core';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { ActivatedRoute } from '@angular/router';
import { AlertController, IonicModule } from '@ionic/angular';
import { Store } from '@ngxs/store';
import { DateTime } from 'luxon';
import { Subscription } from 'rxjs';

import type { ICreatePetDto, IUpdatePetDto } from '@api/types';

import { ToastrService } from '../../../services/toastr.service';
import { BadgeComponent } from '../../../shared/components/badge.component';
import { dateInputToISOString, ISOtoDateInput } from '../../../shared/utils';
import {
  CreatePet,
  DeletePet,
  SubmitPet,
  UpdatePet
} from '../../../state/pets.actions';
import { PetsState } from '../../../state/pets.state';
import * as PetUtils from '../../pet.utils';

@Component({
  selector: 'innut-pet',
  templateUrl: './pet.component.html',
  styleUrls: ['./pet.component.scss'],
  standalone: true,
  imports: [
    IonicModule,
    FormsModule,
    ReactiveFormsModule,
    BadgeComponent,
    NgIf,
    NgFor,
    AsyncPipe,
    CurrencyPipe
  ]
})
export class PetComponent implements AfterViewInit, OnDestroy {
  petForm = PetUtils.initalizePetForm();

  store$ = this.store.select((store) => store.store);

  petId = 'new';
  petStatus: string;
  subscriptions = new Subscription();
  formSubmitted = false;

  constructor(
    private readonly store: Store,
    private readonly alertController: AlertController,
    private readonly toastService: ToastrService,
    private readonly route: ActivatedRoute
  ) {}

  ngAfterViewInit(): void {
    if (this.route.snapshot.params['id']?.length > 3) {
      this.subscriptions.add(
        this.store
          .select(PetsState.getPet(this.route.snapshot.params['id']))
          .subscribe((pet) => {
            if (!pet?.id) {
              return;
            }

            if (pet.status === 'SUBMITTED') {
              this.petForm.disable();
            }

            this.petForm.patchValue({
              kind: pet?.kind,
              date: ISOtoDateInput(pet?.submitDate),
              description: pet?.description
            });

            this.petId = pet.id;
            this.petStatus = pet.status;
          })
      );
    } else if (this.route.snapshot.queryParams['from']) {
      this.subscriptions.add(
        this.store
          .select(PetsState.getPet(this.route.snapshot.queryParams['from']))
          .subscribe((pet) => {
            if (!pet?.id) {
              return;
            }

            this.petForm.patchValue({
              description: pet?.description
            });
          })
      );
    }
  }

  ngOnDestroy(): void {
    this.subscriptions.unsubscribe();
  }

  setDateToday() {
    this.petForm?.get('date')?.setValue(DateTime.now().toISODate());
  }

  openPreview(): void {
    window.open(`/pet-viewer/${this.petId}`, '_blank');
  }

  onSubmit() {
    this.formSubmitted = true;

    if (this.petForm.invalid) {
      this.toastService.createToast({
        header: 'Warning',
        text: 'You must fill out all fields...'
      });
    }

    if (this.petForm.valid) {
      const newPet: ICreatePetDto = {
        submitDate: dateInputToISOString(this.petForm.value.date!),
        description: this.petForm.value.description || '',
        kind: this.petForm.value.kind || 'MAMMAL'
      };

      const updatedPet: IUpdatePetDto = {
        ...newPet
      };

      if (this.petId === 'new') {
        this.store.dispatch(new CreatePet(newPet));
      } else {
        this.store.dispatch(new UpdatePet(this.petId, updatedPet));
      }
    }
  }

  async onSubmitPet() {
    if (this.petForm.invalid) {
      this.formSubmitted = true;
      return this.toastService.createToast({
        header: 'Warning',
        text: 'You must fill out all fields...'
      });
    }

    const alert = await this.alertController.create({
      header: 'Submit pet',
      message: `Do you want to submit this pet?`,
      cssClass: 'alert-submit-pet',
      buttons: [
        {
          text: 'Cancel',
          role: 'cancel',
          cssClass: 'alert-cancel-button'
        },
        {
          text: 'Submit',
          role: 'confirm',
          cssClass: 'alert-confirm-button',
          handler: () => {
            this.store.dispatch(new SubmitPet(this.petId));
          }
        }
      ]
    });

    await alert.present();
  }

  async onDelete() {
    const alert = await this.alertController.create({
      header:
        'Are you sure you want to delete this pet? This action cannot be undone.',
      buttons: [
        {
          text: 'Cancel',
          role: 'cancel',
          cssClass: 'alert-cancel-button'
        },
        {
          text: 'Remove',
          role: 'confirm',
          cssClass: 'alert-confirm-button',
          handler: () => {
            this.store.dispatch(new DeletePet(this.petId));
          }
        }
      ]
    });

    await alert.present();
  }
}

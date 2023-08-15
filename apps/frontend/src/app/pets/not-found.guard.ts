import { Injectable, NgZone } from '@angular/core';
import { ActivatedRouteSnapshot } from '@angular/router';
import { NavController } from '@ionic/angular';
import { Store } from '@ngxs/store';
import { skip, tap } from 'rxjs';

import { ToastrService } from '../services/toastr.service';
import { PetsState } from '../state/pets.state';

@Injectable({
  providedIn: 'root'
})
export class NotFoundGuard {
  constructor(
    private store: Store,
    private navcontroller: NavController,
    private zone: NgZone,
    private toast: ToastrService
  ) {}

  canActivate(route: ActivatedRouteSnapshot): boolean {
    this.store
      .selectOnce(PetsState.getPet(route.paramMap.get('id')!))
      .pipe(
        skip(1),
        tap((pet) => {
          if (!pet) {
            this.toast.dangerToast({
              header: 'Warning',
              text: 'Pet not found'
            });
            this.zone.run(() => {
              this.navcontroller.navigateBack('pets');
            });
          }
          return false;
        })
      )
      .subscribe();
    return true;
  }
}

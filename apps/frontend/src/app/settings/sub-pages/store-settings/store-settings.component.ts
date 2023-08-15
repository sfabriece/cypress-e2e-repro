import { Component } from '@angular/core';
import { IonicModule } from '@ionic/angular';

import { StoreFormComponent } from '../../components/store-form/store-form.component';
import { UserFormComponent } from '../../components/user-form/user-form.component';

@Component({
  selector: 'innut-store-settings',
  templateUrl: './store-settings.component.html',
  styleUrls: ['./store-settings.component.scss'],
  standalone: true,
  imports: [IonicModule, UserFormComponent, StoreFormComponent]
})
export class StoreSettingsComponent {}

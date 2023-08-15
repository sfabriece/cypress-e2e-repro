import { Location } from '@angular/common';
import { Component } from '@angular/core';
import { IonicModule } from '@ionic/angular';

@Component({
  selector: 'innut-error-page',
  templateUrl: './error.page.html',
  styleUrls: ['./error.page.scss'],
  standalone: true,
  imports: [IonicModule]
})
export class ErrorPage {
  constructor(private readonly location: Location) {}

  back(): void {
    this.location.back();
  }
}

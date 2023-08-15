import { NgIf } from '@angular/common';
import { Component, Input, OnInit } from '@angular/core';
import { IonicModule } from '@ionic/angular';

@Component({
  selector: 'innut-step-indicator',
  templateUrl: './step-indicator.component.html',
  styleUrls: ['./step-indicator.component.scss'],
  standalone: true,
  imports: [IonicModule, NgIf]
})
export class StepIndicatorComponent implements OnInit {
  @Input() step = 1;

  constructor() {}

  ngOnInit(): void {}
}

import { NgClass } from '@angular/common';
import { Component, Input, OnChanges, OnInit } from '@angular/core';

import { Status } from '../../types/pet.types';

@Component({
  selector: 'innut-badge',
  template: `
    <div [ngClass]="internalType">
      <p>{{ text }}</p>
    </div>
  `,
  styles: [
    `
      @import './../../../styles.scss';

      .green {
        background-color: map-get($green, 100);
        color: map-get($green, 800);
      }
      .blue {
        background-color: map-get($blue, 100);
        color: map-get($blue, 800);
      }
      .red {
        background-color: map-get($red, 100);
        color: map-get($red, 800);
      }
      .gray {
        background-color: map-get($gray, 200);
        color: map-get($gray, 800);
      }

      div {
        padding: 2px 12px;
        border-radius: 8px;
        width: fit-content;
      }

      p {
        font-size: 0.875rem;
        font-weight: 500;
        line-height: 150%;
      }
    `
  ],
  standalone: true,
  imports: [NgClass]
})
export class BadgeComponent implements OnInit, OnChanges {
  @Input() type: 'green' | 'red' | 'blue' | 'gray';
  @Input() status = 'Testing';
  @Input() text: string | null = '';

  internalType: string;

  constructor() {}

  ngOnInit(): void {
    this.getBadgeColor();
  }

  ngOnChanges(): void {
    this.getBadgeColor();
  }

  getBadgeColor() {
    if (this.type) {
      return (this.internalType = this.type);
    }

    switch (this.status) {
      case Status.draft: {
        return (this.internalType = 'gray'), (this.text = 'Draft');
      }
      case Status.submitted: {
        return (this.internalType = 'blue'), (this.text = 'Submitted');
      }
      case Status.returned: {
        return (this.internalType = 'green'), (this.text = 'Returned');
      }

      default: {
        return (this.internalType = 'green');
      }
    }
  }
}

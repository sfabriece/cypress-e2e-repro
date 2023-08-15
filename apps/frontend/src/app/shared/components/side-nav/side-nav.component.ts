import {
  ChangeDetectionStrategy,
  Component,
  EventEmitter,
  Input,
  OnInit,
  Output
} from '@angular/core';
import { RouterLink, RouterLinkActive } from '@angular/router';
import { IonicModule } from '@ionic/angular';

import type { IUser } from '@api/types';

@Component({
  selector: 'innut-side-nav',
  templateUrl: './side-nav.component.html',
  styleUrls: ['./side-nav.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush,
  standalone: true,
  imports: [IonicModule, RouterLink, RouterLinkActive]
})
export class SideNavComponent implements OnInit {
  @Input() user: IUser | null;
  @Output() closeMenu = new EventEmitter();
  @Output() logout = new EventEmitter();

  userInitals = 'U';

  constructor() {}

  ngOnInit(): void {
    if (this.user) {
      this.userInitals =
        this.user.firstName?.charAt(0) ??
        '' + this.user.lastName?.charAt(0) ??
        '';
    }
  }

  close(event: unknown) {
    this.closeMenu.emit(event);
  }

  logoutUser(event: unknown) {
    this.logout.emit(event);
    this.closeMenu.emit(event);
  }
}

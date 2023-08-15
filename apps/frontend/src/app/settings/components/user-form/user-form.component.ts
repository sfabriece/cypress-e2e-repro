import { AsyncPipe, NgIf } from '@angular/common';
import { Component, EventEmitter, Input, OnInit, Output } from '@angular/core';
import {
  FormControl,
  FormGroup,
  FormsModule,
  ReactiveFormsModule,
  Validators
} from '@angular/forms';
import { IonicModule } from '@ionic/angular';
import { Store } from '@ngxs/store';
import { filter, tap } from 'rxjs';

import { UpdateUser } from '../../../state/auth.actions';
import { AuthState } from '../../../state/auth.state';

@Component({
  selector: 'innut-user-form',
  templateUrl: './user-form.component.html',
  styleUrls: ['./user-form.component.scss'],
  standalone: true,
  imports: [NgIf, FormsModule, ReactiveFormsModule, IonicModule, AsyncPipe]
})
export class UserFormComponent implements OnInit {
  constructor(private store: Store) {}

  @Input() submitButtonText = 'Save';
  @Output() isFormValid = new EventEmitter<boolean>();

  user$ = this.store.select(AuthState.user).pipe(
    filter((user) => !!user),
    tap((user) => {
      this.userForm.patchValue({
        ...user
      });
    })
  );

  userForm = new FormGroup({
    firstName: new FormControl('', Validators.required),
    lastName: new FormControl('', Validators.required),
    email: new FormControl('', [Validators.email, Validators.required]),
    phone: new FormControl('', [Validators.required, Validators.minLength(8)])
  });

  formSubmitted = false;

  ngOnInit(): void {
    this.userForm.controls.email.disable();
  }

  submit(): void {
    this.formSubmitted = true;

    if (this.userForm.valid) {
      this.store.dispatch(
        new UpdateUser({
          firstName: this.userForm.get('firstName')?.value ?? null,
          lastName: this.userForm.get('lastName')?.value ?? null,
          phone: this.userForm.get('phone')?.value ?? null
        })
      );

      this.isFormValid.emit(true);
    }
  }
  handleKeyUp(event: KeyboardEvent) {
    if (event.key === 'Enter') {
      this.submit();
    }
  }
}

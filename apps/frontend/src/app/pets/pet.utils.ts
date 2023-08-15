import { FormControl, FormGroup, Validators } from '@angular/forms';
import { DateTime } from 'luxon';

export const initalizePetForm = () => {
  return new FormGroup({
    date: new FormControl(DateTime.now().toISODate(), Validators.required),
    kind: new FormControl('MAMMAL', Validators.required),
    description: new FormControl('', Validators.required)
  });
};

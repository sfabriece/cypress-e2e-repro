import {
  AfterViewInit,
  Component,
  Input,
  OnChanges,
  SimpleChanges
} from '@angular/core';
import { IonicModule } from '@ionic/angular';
import {
  debounce,
  zxcvbn,
  zxcvbnOptions,
  type ZxcvbnResult
} from '@zxcvbn-ts/core';
import { adjacencyGraphs, dictionary } from '@zxcvbn-ts/language-common';
import {
  dictionary as enDictionary,
  translations
} from '@zxcvbn-ts/language-en';

const options = {
  // recommended
  dictionary: {
    ...dictionary,
    ...enDictionary
    // recommended the language of the country that the user will be in
    // ...zxcvbnDePackage.dictionary,
  },
  // recommended
  graphs: adjacencyGraphs,
  // recommended
  useLevenshteinDistance: true,
  // optional
  translations
};
zxcvbnOptions.setOptions(options);

@Component({
  selector: 'innut-password-strength',
  templateUrl: './password-strength.component.html',
  styleUrls: ['./password-strength.component.scss'],
  standalone: true,
  imports: [IonicModule]
})
export class PasswordStrengthComponent implements OnChanges, AfterViewInit {
  deb = debounce(this.useZxcvbn, 200, false);

  @Input() password?: string | null;

  result = {
    score: 0
  } as ZxcvbnResult;

  ngAfterViewInit(): void {
    this.deb();
  }

  ngOnChanges(changes: SimpleChanges): void {
    if (changes['password']) {
      this.deb();
    }
  }

  async useZxcvbn() {
    if (this.password) {
      const result = await zxcvbn(this.password);
      console.log(result);

      this.result = result;
    } else {
      this.result = {
        score: 0
      } as ZxcvbnResult;
    }
  }
}

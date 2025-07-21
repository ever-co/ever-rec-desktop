import { FormControl } from '@angular/forms';

export interface IFullName {
  fullName: string;
}

export interface IFullNameForm {
  fullName: FormControl<string | null>;
}

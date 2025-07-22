import { FormControl } from '@angular/forms';

export interface IPassword {
  password: string;
}

export interface IPasswordForm {
  password: FormControl<string | null>;
}

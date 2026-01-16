import { FormControl } from '@angular/forms';

export interface IEmail {
  email: string;
}

export interface IEmailPasswordValidation extends IEmail {
  password: string;
}

export interface IEmailForm {
  email: FormControl<string | null>;
}

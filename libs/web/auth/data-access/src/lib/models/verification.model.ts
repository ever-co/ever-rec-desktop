import { FormControl } from '@angular/forms';

export interface IVerification {
  code: string;
}

export interface IVerificationForm {
  code: FormControl<string | null>;
}

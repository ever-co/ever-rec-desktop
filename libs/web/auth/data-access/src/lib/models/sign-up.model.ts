import { FormControl } from '@angular/forms';
import { ICredentials, ILoginForm } from './login.model';

export interface ISignUp extends ICredentials {
  fullName: string;
}

export type ISignUpForm = ILoginForm & {
  confirmPassword: FormControl<string | null>;
  fullName: FormControl<string | null>;
  agreed: FormControl<boolean | null>;
};

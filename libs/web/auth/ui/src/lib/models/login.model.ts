import { FormControl } from '@angular/forms';

export interface ILoginForm {
  email: FormControl<string | null>;
  password: FormControl<string | null>;
}

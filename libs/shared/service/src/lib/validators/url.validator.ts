import { AbstractControl, ValidationErrors, ValidatorFn } from '@angular/forms';
import { urlRegex } from '@ever-co/shared-utils';

export function urlValidator(): ValidatorFn {
  return (control: AbstractControl): ValidationErrors | null => {
    const isValid = urlRegex.test(control.value);
    return isValid ? null : { invalidUrl: true };
  };
}

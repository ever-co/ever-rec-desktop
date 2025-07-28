import { createActionGroup, emptyProps, props } from '@ngrx/store';
import { IFullName } from '../models/full-name.model';
import { IEmailPasswordValidation } from '../models/email.model';

export const userUpdateActions = createActionGroup({
  source: 'user update',
  events: {
    // Reset
    Reset: emptyProps(),

    // update user full name
    'Full Name': props<IFullName>(),
    'Full Name Success': emptyProps(),
    'Full Name Failure': props<{ error: string }>(),

    // update user email
    Email: props<IEmailPasswordValidation>(),
    'Email Success': emptyProps(),
    'Email Failure': props<{ error: string }>(),

    // email verification
    'Email verification': props<{ newEmail: string }>(),
    'Email verification Success': emptyProps(),
    'Email verification Failure': props<{ error: string }>(),
  },
});

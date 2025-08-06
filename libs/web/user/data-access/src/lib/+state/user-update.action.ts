import { createActionGroup, emptyProps, props } from '@ngrx/store';
import { IFullName } from '../models/full-name.model';
import { IEmailPasswordValidation } from '../models/email.model';
import { IProfile } from '../models/profile.model';
import { IPasswordValidation } from '../models/password.model';

export const userUpdateActions = createActionGroup({
  source: 'user update',
  events: {
    // Reset
    Reset: emptyProps(),

    // update user full name
    'Full Name': props<IFullName>(),
    'Full Name Success': props<Partial<IProfile>>(),
    'Full Name Failure': props<{ error: string }>(),

    // update user email
    Email: props<IEmailPasswordValidation>(),
    'Email Success': props<IProfile>(),
    'Email Failure': props<{ error: string }>(),

    // email verification
    'Email verification': props<{ newEmail: string }>(),
    'Email verification Success': emptyProps(),
    'Email verification Failure': props<{ error: string }>(),

    // update user password
    Password: props<IPasswordValidation>(),
    'Password Success': emptyProps(),
    'Password Failure': props<{ error: string }>(),
  },
});

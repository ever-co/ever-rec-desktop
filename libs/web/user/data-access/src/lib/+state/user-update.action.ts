import { createActionGroup, props } from '@ngrx/store';
import { User } from 'firebase/auth';

export const userUpdateActions = createActionGroup({
  source: 'user update',
  events: {
    // update user full name
    'Full Name': props<{ fullName: string }>(),
    'Full Name Success': props<{ user: User }>(),
    'Full Name Failure': props<{ error: string }>(),
  },
});

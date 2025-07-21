import { createActionGroup, emptyProps, props } from '@ngrx/store';
import { IFullName } from '../models/full-name.model';

export const userUpdateActions = createActionGroup({
  source: 'user update',
  events: {
    // update user full name
    'Full Name': props<IFullName>(),
    'Full Name Success': emptyProps(),
    'Full Name Failure': props<{ error: string }>(),
  },
});

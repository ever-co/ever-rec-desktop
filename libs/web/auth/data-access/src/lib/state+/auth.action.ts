import { createActionGroup, emptyProps, props } from '@ngrx/store';
import { ICredentials } from '../models/login.model';
import { IUser } from '@ever-co/shared-utils';

export const authActions = createActionGroup({
  source: 'Authentication',
  events: {
    // Login actions
    Login: props<{
      credentials: ICredentials;
      rememberMe: boolean;
    }>(),
    'Login With Google': emptyProps(),
    'Login Success': props<{ user: IUser; token: string }>(),
    'Login Failure': props<{ error: string }>(),

    // Logout actions
    Logout: emptyProps(),
    'Logout  Success': emptyProps(),

    'Logout failure': props<{ error: string }>(),
  },
});

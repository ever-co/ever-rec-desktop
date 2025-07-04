import { createActionGroup, props } from '@ngrx/store';
import { ICredentials } from '../models/login.model';

export const authActions = createActionGroup({
  source: 'Authentication',
  events: {
    Login: props<{
      credentials: ICredentials;
      rememberMe: boolean;
    }>(),
    'Login Success': props<{ user: IUserFirebase }>(),
    'Login Failure': props<{ error: string }>(),
  },
});

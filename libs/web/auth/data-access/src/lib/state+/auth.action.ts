import { createActionGroup, emptyProps, props } from '@ngrx/store';
import {
  ILoginCredentials,
  ILoginResponse,
  IRefreshToken,
} from '../models/user.model';

export const authActions = createActionGroup({
  source: 'Auth Firebase',
  events: {
    // Login actions
    Login: props<ILoginCredentials>(),
    'Login With Google': emptyProps(),
    'Login Success': props<ILoginResponse>(),
    'Login Failure': props<{ error: string }>(),

    // Logout actions
    Logout: emptyProps(),
    'Logout  Success': emptyProps(),
    'Logout failure': props<{ error: string }>(),

    // Refresh Token
    'Refresh Token': emptyProps(),
    'Refresh Token Success': props<IRefreshToken>(),
    'Refresh Token Failure': props<{ error: string }>(),
  },
});

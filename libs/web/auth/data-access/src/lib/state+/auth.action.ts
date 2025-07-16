import { createActionGroup, emptyProps, props } from '@ngrx/store';
import { ISignUp } from '../models/sign-up.model';
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

    // Sign up actions
    'Sign Up': props<ISignUp>(),
    'Sign Up Success': emptyProps(),
    'Sign Up Failure': props<{ error: string }>(),

    // Send verification email
    'Send Verification Email': emptyProps(),
    'Send Verification Email Success': emptyProps(),
    'Send Verification Email Failure': props<{ error: string }>(),

    // Resend timer actions
    'Start Cooldown': props<{ seconds: number }>(),
    'Decrement Cooldown': emptyProps(),
    'Reset Cooldown': emptyProps(),

    // Email verification polling actions
    'Start Verification Polling': emptyProps(),
    'Stop Verification Polling': emptyProps(),
    'Verification Polling Tick': emptyProps(),
    'Check Verification Success': emptyProps(),
    'Check Verification Failure': props<{ error: string }>(),
  },
});

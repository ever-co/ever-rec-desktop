import { inject, Injectable } from '@angular/core';
import { User, UserCredential } from '@angular/fire/auth';
import { ActivatedRoute, Router } from '@angular/router';
import { NotificationService } from '@ever-co/notification-data-access';
import { Actions, createEffect, ofType } from '@ngrx/effects';
import {
  catchError,
  defer,
  EMPTY,
  exhaustMap,
  filter,
  from,
  interval,
  map,
  of,
  retry,
  map as rxMap,
  switchMap,
  takeWhile,
  throwError,
} from 'rxjs';
import { IProfile } from '../models/profile.model';
import { ISignUp } from '../models/sign-up.model';
import { UserAdapter } from '../models/user.model';
import { AuthErrorService } from '../services/auth-error.service';
import { AuthService } from '../services/auth.service';
import { RefreshTokenService } from '../services/refresh-token.service';
import { authActions } from './auth.action';

@Injectable()
export class AuthEffects {
  private readonly actions$ = inject(Actions);
  private readonly authService = inject(AuthService);
  private readonly router = inject(Router);
  private readonly activatedRoute = inject(ActivatedRoute);
  private readonly notificationService = inject(NotificationService);
  private readonly refreshTokenService = inject(RefreshTokenService);
  private readonly authErrorService = inject(AuthErrorService);

  private handleAuthSuccess(credentials: UserCredential) {
    const adapter = new UserAdapter(credentials.user);
    const user = adapter.clone();
    return from(credentials.user.getIdTokenResult()).pipe(
      map(({ token, expirationTime }) =>
        authActions.loginSuccess({
          user,
          token,
          expiresAt: expirationTime,
        }),
      ),
    );
  }

  private readonly handleAuthError = (err: any) => {
    const error = this.authErrorService.getFirebase(err);
    return of(authActions.loginFailure({ error }));
  };

  public readonly sendEmailVerification$ = createEffect(() =>
    this.actions$.pipe(
      ofType(authActions.sendVerificationEmail),
      map(() => this.authService.checkIfUserIsSignedIn()),
      filter((user): user is User => !!user && !user.emailVerified),
      switchMap((user) =>
        from(this.authService.verify(user)).pipe(
          map(() => authActions.sendVerificationEmailSuccess()),
          catchError((err) =>
            of(authActions.sendVerificationEmailFailure(err)),
          ),
        ),
      ),
    ),
  );

  public readonly startResendTimer$ = createEffect(() =>
    this.actions$.pipe(
      ofType(authActions.sendVerificationEmailSuccess),
      map(() => authActions.startCooldown({ seconds: 60 })),
    ),
  );

  public readonly sendEmailVerificationSuccessNotify$ = createEffect(
    () =>
      this.actions$.pipe(
        ofType(authActions.sendVerificationEmailSuccess),
        switchMap(() => {
          this.notificationService.show(
            'Verification email sent successful',
            'success',
          );
          return EMPTY;
        }),
      ),
    { dispatch: false },
  );

  public readonly sendEmailVerificationFailureNotify$ = createEffect(
    () =>
      this.actions$.pipe(
        ofType(authActions.sendVerificationEmailFailure),
        switchMap(({ error }) => {
          this.notificationService.show(
            `Verification email failed: ${error}`,
            'error',
          );
          return EMPTY;
        }),
      ),
    { dispatch: false },
  );

  public readonly signIn$ = createEffect(() =>
    this.actions$.pipe(
      ofType(authActions.login),
      exhaustMap((action) => {
        this.notificationService.show('Logging in...', 'info');
        return defer(() =>
          this.authService.signIn(
            action.credentials.email,
            action.credentials.password,
          ),
        ).pipe(
          switchMap(this.handleAuthSuccess),
          catchError(this.handleAuthError),
        );
      }),
    ),
  );

  public readonly loginSuccessNotify$ = createEffect(
    () =>
      this.actions$.pipe(
        ofType(authActions.loginSuccess),
        switchMap(({ user }) => {
          this.refreshTokenService.startTimer();
          if (user.isVerified) {
            this.notificationService.show('Login successful', 'success');
          }
          return EMPTY;
        }),
      ),
    { dispatch: false },
  );

  public readonly loginFailureNotify$ = createEffect(
    () =>
      this.actions$.pipe(
        ofType(authActions.loginFailure),
        switchMap(({ error }) => {
          this.notificationService.show(`Login failed: ${error}`, 'error');
          return EMPTY;
        }),
      ),
    { dispatch: false },
  );

  public readonly loginRedirect$ = createEffect(
    () =>
      this.actions$.pipe(
        ofType(authActions.loginSuccess),
        switchMap(() => {
          if (!this.activatedRoute || !this.router) {
            return EMPTY;
          }
          const returnUrl =
            this.activatedRoute.snapshot?.queryParamMap?.get('returnUrl') ||
            '/';
          return from(this.router.navigateByUrl(returnUrl)).pipe(
            catchError((err) => {
              return EMPTY;
            }),
          );
        }),
      ),
    { dispatch: false },
  );

  public readonly signInWithGoogle$ = createEffect(() =>
    this.actions$.pipe(
      ofType(authActions.loginWithGoogle),
      exhaustMap(() => {
        this.notificationService.show('Logging in with Google...', 'info');
        return defer(() => this.authService.signInWithGoogle()).pipe(
          switchMap(this.handleAuthSuccess),
          catchError(this.handleAuthError),
        );
      }),
    ),
  );

  public readonly logout$ = createEffect(() =>
    this.actions$.pipe(
      ofType(authActions.logout),
      exhaustMap(() => {
        this.notificationService.show('Logging out...', 'info');
        return defer(() => this.authService.signOut()).pipe(
          map(() => authActions.logoutSuccess()),
          catchError(this.handleAuthError),
        );
      }),
    ),
  );

  public readonly logoutSuccessNotify$ = createEffect(
    () =>
      this.actions$.pipe(
        ofType(authActions.logoutSuccess),
        switchMap(() => {
          this.refreshTokenService.stopTimer();
          this.notificationService.show('Logged out successfully', 'success');
          return EMPTY;
        }),
      ),
    { dispatch: false },
  );

  public readonly logoutFailureNotify$ = createEffect(
    () =>
      this.actions$.pipe(
        ofType(authActions.logoutFailure),
        switchMap(({ error }) => {
          this.notificationService.show(`Logout failed: ${error}`, 'error');
          return EMPTY;
        }),
      ),
    { dispatch: false },
  );

  public readonly logoutRedirect$ = createEffect(
    () =>
      this.actions$.pipe(
        ofType(authActions.logoutSuccess),
        switchMap(() => {
          return from(
            this.router.navigate(['/auth/login'], {
              replaceUrl: true,
            }),
          ).pipe(catchError(() => EMPTY));
        }),
      ),
    { dispatch: false },
  );

  public readonly refreshToken$ = createEffect(() =>
    this.actions$.pipe(
      ofType(authActions.refreshToken),
      switchMap(() => {
        const user = this.authService.checkIfUserIsSignedIn();
        if (user) {
          return from(this.authService.getRefreshToken(user)).pipe(
            map(({ token, expirationTime }) =>
              authActions.refreshTokenSuccess({
                token,
                expiresAt: expirationTime,
              }),
            ),
            catchError(this.handleAuthError),
          );
        }
        return of(
          authActions.refreshTokenFailure({ error: 'No user logged in' }),
        );
      }),
    ),
  );

  public readonly signUp$ = createEffect(() =>
    this.actions$.pipe(
      ofType(authActions.signUp),
      exhaustMap((action) => this.handleSignUp(action)),
    ),
  );

  public readonly resendTimer$ = createEffect(() =>
    this.actions$.pipe(
      ofType(authActions.startCooldown),
      switchMap(({ seconds }) =>
        interval(1000).pipe(
          takeWhile((count) => count < seconds),
          rxMap(() => authActions.decrementCooldown()),
        ),
      ),
    ),
  );

  private handleSignUp(action: ISignUp) {
    this.notificationService.show('Signing up...', 'info');

    return defer(() => this.authService.signUp(action)).pipe(
      switchMap((credentials) =>
        this.handleUserProfileUpdate(credentials, action),
      ),
      catchError(this.handleAuthError),
    );
  }

  private handleUserProfileUpdate(
    credentials: UserCredential,
    profile: IProfile,
  ) {
    const { user } = credentials;

    return from(this.authService.updateProfile(user, profile)).pipe(
      retry({ count: 2, delay: 1000 }),
      map(() => credentials),
      switchMap((updatedCredentials) =>
        this.handleAuthSuccess(updatedCredentials),
      ),
      catchError((error) => this.cleanupFailedSignUp(user, error)),
    );
  }

  private cleanupFailedSignUp(user: User, error: any) {
    return from(this.authService.deleteUser(user)).pipe(
      switchMap(() => throwError(() => error)),
    );
  }
}

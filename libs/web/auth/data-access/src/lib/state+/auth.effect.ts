import { inject, Injectable } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { NotificationService } from '@ever-co/notification-data-access';
import { Actions, createEffect, ofType } from '@ngrx/effects';
import { Store } from '@ngrx/store';
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
  map as rxMap,
  switchMap,
  takeUntil,
  takeWhile,
} from 'rxjs';
import { tap, withLatestFrom } from 'rxjs/operators';
import { ResStatusEnum } from '../models/auth.model';
import { ISignUp } from '../models/sign-up.model';
import {
  ILoginResponse,
  UserMapper,
} from '../models/user.model';
import { AuthService } from '../services/auth.service';
import { RefreshTokenService } from '../services/refresh-token.service';
import { authActions } from './auth.action';
import { selectToken, selectUser } from './auth.selector';

@Injectable()
export class AuthEffects {
  private readonly actions$ = inject(Actions);
  public readonly startCooldownTimer$ = createEffect(() =>
    this.actions$.pipe(
      ofType(authActions.sendVerificationEmailSuccess),
      map(() => authActions.startCooldown({ seconds: 60 })),
    ),
  );
  public readonly signUp$ = createEffect(() =>
    this.actions$.pipe(
      ofType(authActions.signUp),
      exhaustMap((action) => this.handleSignUp(action)),
    ),
  );
  public readonly cooldownTimer$ = createEffect(() =>
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
  /**
   * Poll for email verification every 10 seconds after sending verification email.
   * If verified, dispatch Check Verification Success and stop polling.
   */
  public readonly startVerificationPolling$ = createEffect(() =>
    this.actions$.pipe(
      ofType(authActions.startVerificationPolling),
      switchMap(() =>
        interval(10000).pipe(
          map(() => authActions.verificationPollingTick()),
          // Stop polling if Stop Verification Polling or Check Verification Success is dispatched
          takeUntil(
            this.actions$.pipe(
              ofType(
                authActions.stopVerificationPolling,
                authActions.checkVerificationSuccess,
              ),
            ),
          ),
        ),
      ),
    ),
  );
  private readonly store = inject(Store);
  private readonly authService = inject(AuthService);
  public readonly resetPassword$ = createEffect(() =>
    this.actions$.pipe(
      ofType(authActions.resetPassword),
      switchMap(({ email }) =>
        from(this.authService.resetPassword(email)).pipe(
          map((response) => {
            if (response.error) {
              return authActions.resetPasswordFailure({
                error: String(response.error ?? response.message),
              });
            }
            if (response.status === ResStatusEnum.error) {
              return authActions.resetPasswordFailure({
                error: response.message,
              });
            }
            return authActions.resetPasswordSuccess();
          }),
          catchError((error) =>
            of(authActions.resetPasswordFailure({ error })),
          ),
        ),
      ),
    ),
  );

  public readonly sendEmailVerification$ = createEffect(() =>
    this.actions$.pipe(
      ofType(authActions.sendVerificationEmail),
      withLatestFrom(
        this.store.select(selectUser),
        this.store.select(selectToken)
      ),
      map(([, user, token]) => ({ user, token })),
      filter(({ user }) => !!user && !user.isVerified),
      switchMap(({ token }) =>
        this.authService.sendEmailVerificationLink(token).pipe(
          map(() => authActions.sendVerificationEmailSuccess()),
          catchError((err) => of(authActions.sendVerificationEmailFailure(err)))
        )
      )
    )
  );

  /**
   * On each polling tick, reload the user and check if verified.
   * If verified, dispatch Check Verification Success and Stop Verification Polling.
   * If error, dispatch Check Verification Failure.
   */
  public readonly verificationPollingTick$ = createEffect(() =>
    this.actions$.pipe(
      ofType(authActions.verificationPollingTick),
      switchMap(() => {
        // Reload user from Firebase to get the latest emailVerified status
        return this.authService.verifyEmail().pipe(
          map(({ data: isVerified }) => isVerified),
          filter(Boolean),
          switchMap((isVerified) => {
            if (isVerified) {
              return [
                authActions.checkVerificationSuccess(),
                authActions.stopVerificationPolling(),
              ];
            }
            return [];
          }),
          catchError((err) =>
            of(
              authActions.checkVerificationFailure({
                error: err?.message || 'Verification check failed',
              }),
            ),
          ),
        );
      }),
    ),
  );
  private readonly router = inject(Router);
  public readonly logoutRedirect$ = createEffect(
    () =>
      this.actions$.pipe(
        ofType(authActions.logoutSuccess, authActions.logoutFailure),
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
  private readonly activatedRoute = inject(ActivatedRoute);
  public readonly loginRedirect$ = createEffect(
    () =>
      this.actions$.pipe(
        ofType(authActions.loginSuccess, authActions.checkVerificationSuccess),
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
  private readonly notificationService = inject(NotificationService);
  public readonly sendEmailVerificationSuccessNotify$ = createEffect(
    () =>
      this.actions$.pipe(
        ofType(authActions.sendVerificationEmailSuccess),
        tap(() => {
          this.notificationService.show(
            'Verification email sent successful',
            'success',
          );
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
  private readonly refreshTokenService = inject(RefreshTokenService);
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

  public readonly refreshToken$ = createEffect(() =>
    this.actions$.pipe(
      ofType(authActions.refreshToken),
      switchMap(() => {
        const user = this.authService.checkIfUserIsSignedIn();
        if (user) {
          return this.authService.getRefreshToken().pipe(
            map(({ token, refreshToken, expiresAt }) =>
              authActions.refreshTokenSuccess({
                token,
                expiresAt,
                refreshToken,
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

  readonly resetPasswordSuccessNotify$ = createEffect(
    () =>
      this.actions$.pipe(
        ofType(authActions.resetPasswordSuccess),
        switchMap(() => {
          this.notificationService.show(
            'Request new password successfully',
            'success',
          );
          return EMPTY;
        }),
      ),
    { dispatch: false },
  );

  readonly resetPasswordFailureNotify$ = createEffect(
    () =>
      this.actions$.pipe(
        ofType(authActions.resetPasswordFailure),
        switchMap(({ error }) => {
          this.notificationService.show(
            `Request new password failed: ${error}`,
            'error',
          );
          return EMPTY;
        }),
      ),
    { dispatch: false },
  );

  private handleAuthSuccess = (credentials: ILoginResponse) => {
    if (credentials.error) {
      return this.handleAuthError(credentials.error);
    }

    if (!credentials.data) {
      return this.handleAuthError(credentials.message);
    }

    const response = credentials.data;
    const user = UserMapper.fromReponseToUser(response);
    const token = response.idToken;
    const refreshToken = response.refreshToken;
    const expiresAt = response.expiresAt;

    return of(
      authActions.loginSuccess({
        user,
        token,
        refreshToken,
        expiresAt,
      }),
    );
  };

  private readonly handleAuthError = (error: any) => {
    return of(authActions.loginFailure({ error: error?.message ?? error }));
  };

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
        return defer(() => of(true)).pipe(
          map(() => authActions.logoutSuccess()),
          catchError(this.handleAuthError),
        );
      }),
    ),
  );

  private handleSignUp(action: ISignUp) {
    this.notificationService.show('Signing up...', 'info');
    return defer(() => this.authService.signUp(action)).pipe(
      switchMap(this.handleAuthSuccess),
      catchError(this.handleAuthError),
    );
  }

  public readonly deleteAccount$ = createEffect(() =>
    this.actions$.pipe(
      ofType(authActions.delete),
      withLatestFrom(this.store.select(selectUser)),
      exhaustMap(([{ password }, user]) =>
        this.authService
          .reauthenticate({
            password,
            email: user?.email ?? '',
          })
          .pipe(
            switchMap(() =>
              this.authService.deleteAccount().pipe(
                switchMap(({ status, message }) => {
                  if (status === 'error') {
                    return of(authActions.deleteFailure({ error: message }));
                  }
                  return [authActions.deleteSuccess(), authActions.logout()];
                }),
                catchError((error) => of(authActions.deleteFailure({ error }))),
              ),
            ),
            catchError((error) => of(authActions.deleteFailure({ error }))),
          ),
      ),
    ),
  );

  public readonly deleteAccountNotify$ = createEffect(
    () =>
      this.actions$.pipe(
        ofType(authActions.delete),
        tap(() => {
          this.notificationService.show('Deleting account...', 'info');
        }),
      ),
    { dispatch: false },
  );

  public readonly deleteAccountSuccessNotify$ = createEffect(
    () =>
      this.actions$.pipe(
        ofType(authActions.deleteSuccess),
        tap(() => {
          this.notificationService.show(
            'Delete account successfully',
            'success',
          );
        }),
      ),
    { dispatch: false },
  );
  public readonly deleteAccountFailureNotify$ = createEffect(
    () =>
      this.actions$.pipe(
        ofType(authActions.deleteFailure),
        tap(() => {
          this.notificationService.show('Delete account failed', 'error');
        }),
      ),
    { dispatch: false },
  );
}

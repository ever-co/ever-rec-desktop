import { inject, Injectable } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { NotificationService } from '@ever-co/notification-data-access';
import { Actions, createEffect, ofType } from '@ngrx/effects';
import {
  catchError,
  defer,
  EMPTY,
  exhaustMap,
  from,
  interval,
  map,
  map as rxMap,
  of,
  switchMap,
  takeUntil,
  takeWhile
} from 'rxjs';
import { ISignUp } from '../models/sign-up.model';
import { ILoginResponse } from '../models/user.model';
import { AuthErrorService } from '../services/auth-error.service';
import { AuthService } from '../services/auth.service';
import { RefreshTokenService } from '../services/refresh-token.service';
import { authActions } from './auth.action';

@Injectable()
export class AuthEffects {
  private readonly actions$ = inject(Actions);
  public readonly startCooldownTimer$ = createEffect(() =>
    this.actions$.pipe(
      ofType(authActions.sendVerificationEmailSuccess),
      map(() => authActions.startCooldown({ seconds: 60 }))
    )
  );
  public readonly signUp$ = createEffect(() =>
    this.actions$.pipe(
      ofType(authActions.signUp),
      exhaustMap((action) => this.handleSignUp(action))
    )
  );
  public readonly cooldownTimer$ = createEffect(() =>
    this.actions$.pipe(
      ofType(authActions.startCooldown),
      switchMap(({ seconds }) =>
        interval(1000).pipe(
          takeWhile((count) => count < seconds),
          rxMap(() => authActions.decrementCooldown())
        )
      )
    )
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
                authActions.checkVerificationSuccess
              )
            )
          )
        )
      )
    )
  );
  private readonly authService = inject(AuthService);
  public readonly resetPassword$ = createEffect(() =>
    this.actions$.pipe(
      ofType(authActions.resetPassword),
      switchMap(({ email }) =>
        from(this.authService.resetPassword(email)).pipe(
          map(() => authActions.resetPasswordSuccess()),
          catchError((error) =>
            of(authActions.resetPasswordFailure({ error }))
          )
        )
      )
    )
  );
  private readonly router = inject(Router);
  public readonly logoutRedirect$ = createEffect(
    () =>
      this.actions$.pipe(
        ofType(authActions.logoutSuccess),
        switchMap(() => {
          return from(
            this.router.navigate(['/auth/login'], {
              replaceUrl: true
            })
          ).pipe(catchError(() => EMPTY));
        })
      ),
    { dispatch: false }
  );

  // public readonly sendEmailVerification$ = createEffect(() =>
  //   this.actions$.pipe(
  //     ofType(authActions.sendVerificationEmail),
  //     map(() => this.authService.checkIfUserIsSignedIn()),
  //     filter((user): user is User => !!user && !user.emailVerified),
  //     switchMap((user) =>
  //       from(this.authService.verify(user)).pipe(
  //         map(() => authActions.sendVerificationEmailSuccess()),
  //         catchError((err) =>
  //           of(authActions.sendVerificationEmailFailure(err)),
  //         ),
  //       ),
  //     ),
  //   ),
  // );
  private readonly activatedRoute = inject(ActivatedRoute);
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
            })
          );
        })
      ),
    { dispatch: false }
  );
  private readonly notificationService = inject(NotificationService);
  public readonly sendEmailVerificationSuccessNotify$ = createEffect(
    () =>
      this.actions$.pipe(
        ofType(authActions.sendVerificationEmailSuccess),
        switchMap(() => {
          this.notificationService.show(
            'Verification email sent successful',
            'success'
          );
          return EMPTY;
        })
      ),
    { dispatch: false }
  );
  public readonly sendEmailVerificationFailureNotify$ = createEffect(
    () =>
      this.actions$.pipe(
        ofType(authActions.sendVerificationEmailFailure),
        switchMap(({ error }) => {
          this.notificationService.show(
            `Verification email failed: ${error}`,
            'error'
          );
          return EMPTY;
        })
      ),
    { dispatch: false }
  );
  public readonly loginFailureNotify$ = createEffect(
    () =>
      this.actions$.pipe(
        ofType(authActions.loginFailure),
        switchMap(({ error }) => {
          this.notificationService.show(`Login failed: ${error}`, 'error');
          return EMPTY;
        })
      ),
    { dispatch: false }
  );
  public readonly logoutFailureNotify$ = createEffect(
    () =>
      this.actions$.pipe(
        ofType(authActions.logoutFailure),
        switchMap(({ error }) => {
          this.notificationService.show(`Logout failed: ${error}`, 'error');
          return EMPTY;
        })
      ),
    { dispatch: false }
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
        })
      ),
    { dispatch: false }
  );
  public readonly logoutSuccessNotify$ = createEffect(
    () =>
      this.actions$.pipe(
        ofType(authActions.logoutSuccess),
        switchMap(() => {
          this.refreshTokenService.stopTimer();
          this.notificationService.show('Logged out successfully', 'success');
          return EMPTY;
        })
      ),
    { dispatch: false }
  );
  private readonly authErrorService = inject(AuthErrorService);
  private readonly resetPasswordSuccessNotify$ = createEffect(
    () =>
      this.actions$.pipe(
        ofType(authActions.resetPasswordSuccess),
        switchMap(() => {
          this.notificationService.show(
            'Request new password successfully',
            'success'
          );
          return EMPTY;
        })
      ),
    { dispatch: false }
  );

  // public readonly refreshToken$ = createEffect(() =>
  //   this.actions$.pipe(
  //     ofType(authActions.refreshToken),
  //     switchMap(() => {
  //       const user = this.authService.checkIfUserIsSignedIn();
  //       if (user) {
  //         return from(this.authService.getRefreshToken(user)).pipe(
  //           map(({ token, expirationTime }) =>
  //             authActions.refreshTokenSuccess({
  //               token,
  //               expiresAt: expirationTime,
  //             }),
  //           ),
  //           catchError(this.handleAuthError),
  //         );
  //       }
  //       return of(
  //         authActions.refreshTokenFailure({ error: 'No user logged in' }),
  //       );
  //     }),
  //   ),
  // );
  private readonly resetPasswordFailureNotify$ = createEffect(
    () =>
      this.actions$.pipe(
        ofType(authActions.resetPasswordFailure),
        switchMap(({ error }) => {
          this.notificationService.show(
            `Request new password failed: ${error}`,
            'error'
          );
          return EMPTY;
        })
      ),
    { dispatch: false }
  );

  private handleAuthSuccess(credentials: ILoginResponse) {
    if (credentials.error) {
      return this.handleAuthError(credentials.error);
    }

    const user = credentials.data;
    const token = credentials.data.idToken;
    const refreshToken = credentials.data.refreshToken;
    const expiresAt = '2026-01-01T00:00:00.000Z';

    return of(
      authActions.loginSuccess({
        user,
        token,
        refreshToken,
        expiresAt
      })
    );
  }

  private readonly handleAuthError = (error: any) => {
    return of(authActions.loginFailure({ error }));
  };

  /**
   * On each polling tick, reload the user and check if verified.
   * If verified, dispatch Check Verification Success and Stop Verification Polling.
   * If error, dispatch Check Verification Failure.
   */
  // public readonly verificationPollingTick$ = createEffect(() =>
  //   this.actions$.pipe(
  //     ofType(authActions.verificationPollingTick),
  //     switchMap(() => {
  //       const user = this.authService.checkIfUserIsSignedIn();
  //       if (!user) {
  //         return of(
  //           authActions.checkVerificationFailure({
  //             error: 'No user signed in',
  //           }),
  //         );
  //       }
  //       // Reload user from Firebase to get latest emailVerified status
  //       return from(user.reload()).pipe(
  //         switchMap(() => {
  //           if (user.emailVerified) {
  //             return [
  //               authActions.checkVerificationSuccess(),
  //               authActions.stopVerificationPolling(),
  //             ];
  //           }
  //           return [];
  //         }),
  //         catchError((err) =>
  //           of(
  //             authActions.checkVerificationFailure({
  //               error: err?.message || 'Verification check failed',
  //             }),
  //           ),
  //         ),
  //       );
  //     }),
  //   ),
  // );

  /**
   * Helper for auto-login with a User instance (not UserCredential).
   */
    // private handleUserAutoLogin(user: User) {
    //   const adapter = new UserAdapter(user);
    //   const userObj = adapter.clone();
    //   return from(user.getIdTokenResult()).pipe(
    //     map(({ token, expirationTime }) =>
    //       authActions.loginSuccess({
    //         user: userObj,
    //         token,
    //         expiresAt: expirationTime,
    //       }),
    //     ),
    //   );
    // }

  public readonly signIn$ = createEffect(() =>
    this.actions$.pipe(
      ofType(authActions.login),
      exhaustMap((action) => {
        this.notificationService.show('Logging in...', 'info');
        return defer(() =>
          this.authService.signIn(
            action.credentials.email,
            action.credentials.password
          )
        ).pipe(
          switchMap(this.handleAuthSuccess),
          catchError(this.handleAuthError)
        );

      })
    )
  );
  public readonly signInWithGoogle$ = createEffect(() =>
    this.actions$.pipe(
      ofType(authActions.loginWithGoogle),
      exhaustMap(() => {
        this.notificationService.show('Logging in with Google...', 'info');
        return defer(() => this.authService.signInWithGoogle()).pipe(
          switchMap(this.handleAuthSuccess),
          catchError(this.handleAuthError)
        );
      })
    )
  );
  public readonly logout$ = createEffect(() =>
    this.actions$.pipe(
      ofType(authActions.logout),
      exhaustMap(() => {
        this.notificationService.show('Logging out...', 'info');
        return defer(() => this.authService.signOut()).pipe(
          map(() => authActions.logoutSuccess()),
          catchError(this.handleAuthError)
        );
      })
    )
  );

  /**
   * On successful verification, auto-login and redirect.
   */
  // public readonly checkVerificationSuccess$ = createEffect(() =>
  //   this.actions$.pipe(
  //     ofType(authActions.checkVerificationSuccess),
  //     switchMap(() => {
  //       const user = this.authService.checkIfUserIsSignedIn();
  //       if (!user) {
  //         return of(
  //           authActions.loginFailure({ error: 'No user found for auto-login' }),
  //         );
  //       }
  //       return this.handleUserAutoLogin(user).pipe(
  //         catchError((err) =>
  //           of(
  //             authActions.loginFailure({
  //               error: err?.message || 'Auto-login failed',
  //             }),
  //           ),
  //         ),
  //       );
  //     }),
  //   ),
  // );

  private handleSignUp(action: ISignUp) {
    this.notificationService.show('Signing up...', 'info');
    return defer(() => this.authService.signUp(action)).pipe(
      switchMap(this.handleAuthSuccess),
      catchError(this.handleAuthError)
    );
  }
}

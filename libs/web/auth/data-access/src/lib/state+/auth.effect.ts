import { inject, Injectable } from '@angular/core';
import { Actions, createEffect, ofType } from '@ngrx/effects';
import { catchError, defer, exhaustMap, from, map, of, switchMap, EMPTY } from 'rxjs';
import { UserAdapter } from '../models/user.model';
import { AuthService } from '../services/auth.service';
import { authActions } from './auth.action';
import { UserCredential } from '@angular/fire/auth';
import { Router, ActivatedRoute } from '@angular/router';
import { NotificationService } from '@ever-co/notification-data-access';

@Injectable()
export class AuthEffects {
  private readonly actions$ = inject(Actions);
  private readonly authService = inject(AuthService);
  private readonly router = inject(Router);
  private readonly activatedRoute = inject(ActivatedRoute);
  private readonly notificationService = inject(NotificationService);

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

  private handleAuthError(error: string) {
    return of(authActions.loginFailure({ error }));
  }

  public readonly signIn$ = createEffect(() =>
    this.actions$.pipe(
      ofType(authActions.login),
      exhaustMap((action) => {
        this.notificationService.show('Logging in...', 'info');
        return defer(() => this.authService.signIn(action.credentials.email, action.credentials.password)).pipe(
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
        switchMap(() => {
          this.notificationService.show('Login successful', 'success');
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

  public readonly loginRedirect$ = createEffect(
    () =>
      this.actions$.pipe(
        ofType(authActions.loginSuccess),
        switchMap(() => {
          if (!this.activatedRoute || !this.router) {
            return EMPTY;
          }
          const returnUrl = this.activatedRoute.snapshot?.queryParamMap?.get('returnUrl') || '/';
          return from(this.router.navigateByUrl(returnUrl)).pipe(
            catchError((err) => {
              return EMPTY;
            })
          );
        })
      ),
    { dispatch: false }
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
          catchError((error) => of(authActions.logoutFailure({ error }))),
        );
      }),
    ),
  );

  public readonly logoutSuccessNotify$ = createEffect(
    () =>
      this.actions$.pipe(
        ofType(authActions.logoutSuccess),
        switchMap(() => {
          this.notificationService.show('Logged out successfully', 'success');
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

  public readonly logoutRedirect$ = createEffect(
    () =>
      this.actions$.pipe(
        ofType(authActions.logoutSuccess),
        switchMap(() => {
          return from(this.router.navigate(['/auth/login'], {
            replaceUrl: true
          })).pipe(
            catchError(() => EMPTY)
          );
        })
      ),
    { dispatch: false }
  );
}

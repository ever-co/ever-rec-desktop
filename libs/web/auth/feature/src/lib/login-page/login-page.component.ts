import { CommonModule } from '@angular/common';
import {
  ChangeDetectionStrategy,
  Component,
  Inject,
  signal,
} from '@angular/core';
import { MatIconModule } from '@angular/material/icon';
import { MatProgressSpinnerModule } from '@angular/material/progress-spinner';
import { Router } from '@angular/router';
import {
  authActions,
  ICredentials,
  selectAuthLoading,
} from '@ever-co/auth-data-access';
import { LoginFormComponent } from '@ever-co/auth-ui';
import { REC_ENV } from '@ever-co/shared-service';
import { IEnvironment } from '@ever-co/shared-utils';
import { Actions, ofType } from '@ngrx/effects';
import { Store } from '@ngrx/store';
import { Observable } from 'rxjs';
import { take } from 'rxjs/operators';

@Component({
  selector: 'lib-login-page',
  imports: [
    CommonModule,
    LoginFormComponent,
    MatIconModule,
    MatProgressSpinnerModule,
  ],
  templateUrl: './login-page.component.html',
  styleUrl: './login-page.component.scss',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class LoginPageComponent {
  public readonly isGoogle = signal<boolean>(false);

  constructor(
    @Inject(REC_ENV) public env: IEnvironment,
    private readonly store: Store,
    private readonly router: Router,
    private readonly actions$: Actions,
  ) {
    // Listen for loginSuccess and redirect
    this.actions$
      .pipe(ofType(authActions.loginSuccess), take(1))
      .subscribe(() => {
        // Try to get the latest route from localStorage
        const latestRoute = localStorage.getItem('latestRoute');
        if (latestRoute) {
          localStorage.removeItem('latestRoute');
          this.router.navigateByUrl(latestRoute);
        } else {
          this.router.navigateByUrl('/');
        }
      });
  }

  public signInWithGoogle() {
    this.isGoogle.update(() => true);
    this.store.dispatch(authActions.loginWithGoogle());
  }

  public get loading$(): Observable<boolean> {
    return this.store.select(selectAuthLoading);
  }

  public signInWithEmail(event: ICredentials) {
    this.isGoogle.update(() => false);
    this.store.dispatch(
      authActions.login({ credentials: event, rememberMe: false }),
    );
  }
}

import { ChangeDetectionStrategy, Component, Inject } from '@angular/core';
import { MatIconModule } from '@angular/material/icon';
import { authActions, ICredentials } from '@ever-co/auth-data-access';
import { LoginFormComponent } from '@ever-co/auth-ui';
import { REC_ENV } from '@ever-co/shared-service';
import { IEnvironment } from '@ever-co/shared-utils';
import { Store } from '@ngrx/store';
import { Router } from '@angular/router';
import { Actions, ofType } from '@ngrx/effects';
import { filter, take } from 'rxjs/operators';

@Component({
  selector: 'lib-login-page',
  imports: [LoginFormComponent, MatIconModule],
  templateUrl: './login-page.component.html',
  styleUrl: './login-page.component.scss',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class LoginPageComponent {
  constructor(
    @Inject(REC_ENV) public env: IEnvironment,
    private readonly store: Store,
    private readonly router: Router,
    private readonly actions$: Actions,
  ) {
    // Listen for loginSuccess and redirect
    this.actions$
      .pipe(
        ofType(authActions.loginSuccess),
        take(1),
      )
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
    this.store.dispatch(authActions.loginWithGoogle());
  }

  public signInWithEmail(event: ICredentials) {
    this.store.dispatch(
      authActions.login({ credentials: event, rememberMe: false }),
    );
  }
}

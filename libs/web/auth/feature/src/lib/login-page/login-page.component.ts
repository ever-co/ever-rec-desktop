import { ChangeDetectionStrategy, Component, Inject } from '@angular/core';
import { MatIconModule } from '@angular/material/icon';
import { authActions, ICredentials } from '@ever-co/auth-data-access';
import { LoginFormComponent } from '@ever-co/auth-ui';
import { REC_ENV } from '@ever-co/shared-service';
import { IEnvironment } from '@ever-co/shared-utils';
import { Store } from '@ngrx/store';

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
  ) {}
  public signInWithGoogle() {
    this.store.dispatch(authActions.loginWithGoogle());
  }

  public signInWithEmail(event: ICredentials) {
    this.store.dispatch(
      authActions.login({ credentials: event, rememberMe: false }),
    );
  }
}

import { ChangeDetectionStrategy, Component, Inject } from '@angular/core';
import { MatIconModule } from '@angular/material/icon';
import { LoginFormComponent } from '@ever-co/auth-ui';
import { REC_ENV } from '@ever-co/shared-service';
import { IEnvironment } from '@ever-co/shared-utils';

@Component({
  selector: 'lib-login-page',
  imports: [LoginFormComponent, MatIconModule],
  templateUrl: './login-page.component.html',
  styleUrl: './login-page.component.scss',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class LoginPageComponent {
  constructor(@Inject(REC_ENV) public env: IEnvironment) {}
  signInWithGoogle() {
    // Implement your Google sign-in logic here
    console.log('Google sign-in clicked');
  }
}

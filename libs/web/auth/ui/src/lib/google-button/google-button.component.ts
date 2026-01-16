import { ChangeDetectionStrategy, Component, Inject, input, OnDestroy, OnInit, output, signal } from '@angular/core';
import { MatButtonModule } from '@angular/material/button';
import { ILoginGoogle } from '@ever-co/auth-data-access';
import { REC_ENV } from '@ever-co/shared-service';
import { Channel, IEnvironment } from '@ever-co/shared-utils';
import { ElectronService } from '@ever-co/electron-data-access';
import { Subject, takeUntil, tap } from 'rxjs';

@Component({
  selector: 'lib-google-button',
  templateUrl: './google-button.component.html',
  styleUrls: ['./google-button.component.scss'],
  imports: [MatButtonModule],
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class GoogleButtonComponent implements OnInit, OnDestroy {
  public readonly signIn = output<ILoginGoogle>({ alias: 'signInWithGoogle' });
  public readonly loading = input<boolean>(false);
  private readonly destroy$ = new Subject<void>();
  public readonly showCancelSignin = signal<boolean>(false);

  constructor(
    @Inject(REC_ENV)
    private env: IEnvironment,
    private electronService: ElectronService
  ) {
  }

  public ngOnInit(): void {
    this.electronService
      .fromEvent<ILoginGoogle>(Channel.GOOGLE_AUTH_LOGIN)
      .pipe(
        tap((response) => this.signIn.emit(response)),
        tap(() => this.showCancelSignin.update(() => false)),
        takeUntil(this.destroy$)
      )
      .subscribe();
  }

  public async handleGoogleSignIn(): Promise<void> {
    // Check for required environment variables for robustness
    if (!this.env.google?.clientId) {
      console.error('Environment variable "googleClientId" is missing.');
      return;
    }

    this.showCancelSignin.update(() => true);

    // Use the redirect URI from the environment for better maintainability.
    const clientId = this.env.google.clientId;
    const redirectUri = this.env.google.redirectUri;

    const authUrl = new URL('https://accounts.google.com/o/oauth2/v2/auth');
    authUrl.search = new URLSearchParams({
      client_id: clientId,
      redirect_uri: redirectUri,
      response_type: 'id_token token',
      scope: 'openid email profile',
      state: crypto.randomUUID(),
      nonce: crypto.randomUUID(),
      prompt: 'consent'
    } as any).toString();

    await this.electronService.openExternal(authUrl.toString());
  }

  public handleCancelSignin(): void {
    this.showCancelSignin.update(() => false);
  }

  ngOnDestroy() {
    this.destroy$.next();
    this.destroy$.complete();
  }
}

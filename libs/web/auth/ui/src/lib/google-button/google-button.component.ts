import {
  AfterViewInit,
  ChangeDetectionStrategy,
  Component,
  ElementRef,
  Inject,
  NgZone,
  OnInit,
  output,
  viewChild,
} from '@angular/core';
import { ILoginGoogle } from '@ever-co/auth-data-access';
import { REC_ENV } from '@ever-co/shared-service';
import { IEnvironment } from '@ever-co/shared-utils';

declare const google: any;

@Component({
  selector: 'lib-google-button',
  templateUrl: './google-button.component.html',
  styleUrls: ['./google-button.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class GoogleButtonComponent implements OnInit, AfterViewInit {
  public readonly googleButton = viewChild<ElementRef>('google');
  public readonly signIn = output<ILoginGoogle>({ alias: 'signInWithGoogle' });

  constructor(
    @Inject(REC_ENV)
    private env: IEnvironment,
    private ngZone: NgZone,
  ) {}

  ngOnInit(): void {
    this.initializeGoogleSignIn();
  }

  ngAfterViewInit(): void {
    this.renderGoogleButton();
  }

  private initializeGoogleSignIn(): void {
    google.accounts.id.initialize({
      client_id: this.env.googleClientId,
      callback: (response: ILoginGoogle) => {
        this.ngZone.run(() => {
          this.signIn.emit(response);
        });
      },
      cancel_on_tap_outside: false,
    });

    google.accounts.id.prompt();
  }

  private renderGoogleButton(): void {
    const buttonElement = this.googleButton()?.nativeElement;
    google.accounts.id.renderButton(buttonElement, {
      theme: 'outline',
      size: 'large',
      text: 'continue_with',
    });
  }
}

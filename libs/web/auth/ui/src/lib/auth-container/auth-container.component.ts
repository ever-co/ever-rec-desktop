
import {
  ChangeDetectionStrategy,
  Component,
  Inject,
  input,
} from '@angular/core';
import { MatIconModule } from '@angular/material/icon';
import { MatProgressSpinnerModule } from '@angular/material/progress-spinner';
import { RouterModule } from '@angular/router';
import { IEnvironment } from '@ever-co/shared-utils';
import { REC_ENV } from '@ever-co/shared-service';

@Component({
  selector: 'lib-auth-container',
  standalone: true,
  imports: [
    MatIconModule,
    MatProgressSpinnerModule,
    RouterModule
],
  templateUrl: './auth-container.component.html',
  styleUrls: ['./auth-container.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class AuthContainerComponent {
  title = input.required<string>();
  subtitle = input.required<string>();
  footerText = input('', { alias: 'text' });
  footerLink = input('', { alias: 'link' });
  footerLinkText = input('', { alias: 'linkText' });

  constructor(@Inject(REC_ENV) public env: IEnvironment) {}
}

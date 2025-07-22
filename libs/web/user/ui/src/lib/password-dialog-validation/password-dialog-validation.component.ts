import { ChangeDetectionStrategy, Component } from '@angular/core';
import { PasswordFormComponent } from '../password-form/password-form.component';

@Component({
  selector: 'lib-password-dialog-validation',
  imports: [PasswordFormComponent],
  templateUrl: './password-dialog-validation.component.html',
  styleUrl: './password-dialog-validation.component.scss',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class PasswordDialogValidationComponent {}

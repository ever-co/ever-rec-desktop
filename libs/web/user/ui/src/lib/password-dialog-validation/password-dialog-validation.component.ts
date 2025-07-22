import { CommonModule } from '@angular/common';
import { ChangeDetectionStrategy, Component } from '@angular/core';
import { MatDialogModule, MatDialogRef } from '@angular/material/dialog';
import { ActionButtonComponent } from '@ever-co/shared-components';
import { IActionButton } from '@ever-co/shared-utils';
import { IPassword } from '@ever-co/user-data-access';
import {
  IPasswordConfig,
  PasswordFormComponent,
} from '../password-form/password-form.component';
import { MatIconModule } from '@angular/material/icon';

@Component({
  selector: 'lib-password-dialog-validation',
  imports: [
    PasswordFormComponent,
    CommonModule,
    MatDialogModule,
    ActionButtonComponent,
    MatIconModule,
  ],
  templateUrl: './password-dialog-validation.component.html',
  styleUrl: './password-dialog-validation.component.scss',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class PasswordDialogValidationComponent {
  public readonly config: IPasswordConfig = {
    submit: {
      icon: 'shield_locked',
      variant: 'warning',
      action: this.onConfirm.bind(this),
      label: 'Confirm',
    },
    cancel: {
      variant: 'danger',
      action: this.onCancel.bind(this),
    },
    showCancel: true,
  };

  constructor(public dialogRef: MatDialogRef<PasswordFormComponent>) {}

  public onCancel(): void {
    this.dialogRef.close(null);
  }

  public onConfirm(password: IPassword): void {
    this.dialogRef.close(password);
  }
}

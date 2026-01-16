
import { ChangeDetectionStrategy, Component, Inject } from '@angular/core';
import {
  MAT_DIALOG_DATA,
  MatDialogModule,
  MatDialogRef,
} from '@angular/material/dialog';
import { IActionButton, IConfirmationDialog } from '@ever-co/shared-utils';
import { ActionButtonComponent } from '../../action-button-group/button/action-button.component';

@Component({
  selector: 'lib-confirmation',
  imports: [MatDialogModule, ActionButtonComponent],
  templateUrl: './confirmation.component.html',
  styleUrl: './confirmation.component.scss',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class ConfirmationComponent {
  public buttonConfirm: IActionButton = {
    icon: 'check',
    variant: 'success',
    action: this.onConfirm.bind(this),
    label: 'Confirm',
    ...this.data.button?.confirm,
  };
  public buttonCancel: IActionButton = {
    icon: 'close',
    variant: 'danger',
    action: this.onCancel.bind(this),
    label: 'Cancel',
    ...this.data.button?.cancel,
  };
  constructor(
    public dialogRef: MatDialogRef<ConfirmationComponent>,
    @Inject(MAT_DIALOG_DATA) public data: IConfirmationDialog
  ) {}

  public getColorClass(): string {
    const variants = {
      success: ' rgb(5 150 105)',
      danger: 'rgb(225 29 72)',
      warning: 'rgb(202 138 4)',
      primary:
        'var(--mat-button-outlined-state-layer-color, var(--mat-sys-primary))',
      default: 'darkgray',
      info: ' rgb(37 99 235)',
    };
    return variants[this.data.variant || 'default'];
  }

  public onCancel(): void {
    this.dialogRef.close(false);
  }

  public onConfirm(): void {
    this.dialogRef.close(true);
  }
}

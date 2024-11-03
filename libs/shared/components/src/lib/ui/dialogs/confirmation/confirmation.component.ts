import { CommonModule } from '@angular/common';
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
  standalone: true,
  imports: [CommonModule, MatDialogModule, ActionButtonComponent],
  templateUrl: './confirmation.component.html',
  styleUrl: './confirmation.component.scss',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class ConfirmationComponent {
  public buttonConfirm: IActionButton = {
    label: this.data?.label?.cancel ?? 'Confirm',
    icon: 'check',
    variant: 'success',
    action: this.onConfirm.bind(this),
  };
  public buttonCancel: IActionButton = {
    label: this.data?.label?.cancel ?? 'Cancel',
    icon: 'close',
    variant: 'danger',
    action: this.onCancel.bind(this),
  };
  constructor(
    public dialogRef: MatDialogRef<ConfirmationComponent>,
    @Inject(MAT_DIALOG_DATA) public data: IConfirmationDialog
  ) {}

  public onCancel(): void {
    this.dialogRef.close(false);
  }

  public onConfirm(): void {
    this.dialogRef.close(true);
  }
}

import { Injectable } from '@angular/core';
import { MatDialog } from '@angular/material/dialog';
import { IConfirmationDialog } from '@ever-co/shared-utils';
import { Observable } from 'rxjs';
import { ConfirmationComponent } from '../confirmation/confirmation.component';

@Injectable({
  providedIn: 'root',
})
export class ConfirmationDialogService {
  constructor(private dialog: MatDialog) {}

  public open(data: IConfirmationDialog): Observable<boolean> {
    const dialogRef = this.dialog.open(ConfirmationComponent, {
      data: data,
    });
    return dialogRef.afterClosed();
  }
}

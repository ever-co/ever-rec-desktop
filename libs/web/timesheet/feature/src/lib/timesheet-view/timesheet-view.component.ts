import { CommonModule } from '@angular/common';
import { ChangeDetectionStrategy, Component } from '@angular/core';
import { MatButtonModule } from '@angular/material/button';
import { MatDialogRef } from '@angular/material/dialog';
import { MatIconModule } from '@angular/material/icon';
import { TimelineContainerComponent } from '@ever-co/timeline-feature';

@Component({
    selector: 'lib-timesheet-view',
    imports: [
        CommonModule,
        MatButtonModule,
        MatIconModule,
        TimelineContainerComponent,
    ],
    templateUrl: './timesheet-view.component.html',
    styleUrl: './timesheet-view.component.scss',
    changeDetection: ChangeDetectionStrategy.OnPush
})
export class TimesheetViewComponent {
  constructor(
    private readonly dialogRef: MatDialogRef<TimesheetViewComponent>
  ) {}

  public close(): void {
    this.dialogRef.close();
  }
}

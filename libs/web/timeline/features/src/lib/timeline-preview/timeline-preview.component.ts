import { CommonModule } from '@angular/common';
import { ChangeDetectionStrategy, Component } from '@angular/core';
import { MatButtonModule } from '@angular/material/button';
import { MatDialogRef } from '@angular/material/dialog';
import { MatIconModule } from '@angular/material/icon';
import { ScreenshotComponent } from '@ever-co/screenshot-feature';
import { ITimelineFrame } from '@ever-co/shared-utils';
import { selectTimelineState } from '@ever-co/timeline-data-access';
import { Store } from '@ngrx/store';
import { map, Observable } from 'rxjs';

@Component({
  selector: 'lib-timeline-preview',
  standalone: true,
  imports: [CommonModule, ScreenshotComponent, MatButtonModule, MatIconModule],
  templateUrl: './timeline-preview.component.html',
  styleUrl: './timeline-preview.component.scss',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class TimelinePreviewComponent {
  constructor(
    private readonly store: Store,
    private readonly dialogRef: MatDialogRef<TimelinePreviewComponent>
  ) {}

  public get frame$(): Observable<ITimelineFrame | null> {
    return this.store
      .select(selectTimelineState)
      .pipe(map(({ track }) => track.frame));
  }

  public close(): void {
    this.dialogRef.close();
  }
}

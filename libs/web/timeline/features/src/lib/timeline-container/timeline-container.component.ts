import { CommonModule } from '@angular/common';
import {
  ChangeDetectionStrategy,
  Component,
  OnDestroy,
  OnInit,
} from '@angular/core';
import { selectGenerateVideoState } from '@ever-co/convert-video-data-access';
import { timelineActions } from '@ever-co/timeline-data-access';
import { Store } from '@ngrx/store';
import { Subject, takeUntil, tap } from 'rxjs';
import { TimelineCursorComponent } from '../timeline-cursor/timeline-cursor.component';
import { TimelineTrackComponent } from '../timeline-track/timeline-track.component';
import { TimelineVideoComponent } from '../timeline-video/timeline-video.component';

@Component({
  selector: 'lib-timeline-container',
  standalone: true,
  imports: [
    CommonModule,
    TimelineTrackComponent,
    TimelineVideoComponent,
    TimelineCursorComponent,
  ],
  templateUrl: './timeline-container.component.html',
  styleUrl: './timeline-container.component.scss',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class TimelineContainerComponent implements OnInit, OnDestroy {
  private destroy$ = new Subject<void>();

  constructor(private readonly store: Store) {}

  ngOnInit(): void {
    this.store
      .select(selectGenerateVideoState)
      .pipe(
        tap((state) =>
          this.store.dispatch(timelineActions.loadLastVideo(state))
        ),
        takeUntil(this.destroy$)
      )
      .subscribe();
  }

  ngOnDestroy(): void {
    this.destroy$.next();
    this.destroy$.complete();
  }
}

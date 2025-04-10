import { CommonModule } from '@angular/common';
import {
  ChangeDetectionStrategy,
  Component,
  OnDestroy,
  OnInit,
} from '@angular/core';
import { selectGenerateVideoState } from '@ever-co/convert-video-data-access';
import { ProgressComponent } from '@ever-co/convert-video-feature';
import { timelineActions } from '@ever-co/timeline-data-access';
import { Store } from '@ngrx/store';
import { map, Observable, Subject, takeUntil, tap } from 'rxjs';
import { TimelineCursorComponent } from '../timeline-cursor/timeline-cursor.component';
import { TimelineTrackComponent } from '../timeline-track/timeline-track.component';
import { TimelineVideoComponent } from '../timeline-video/timeline-video.component';

@Component({
    selector: 'lib-timeline-container',
    imports: [
        CommonModule,
        TimelineTrackComponent,
        TimelineVideoComponent,
        TimelineCursorComponent,
        ProgressComponent,
    ],
    templateUrl: './timeline-container.component.html',
    styleUrl: './timeline-container.component.scss',
    changeDetection: ChangeDetectionStrategy.OnPush
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

  public get generating$(): Observable<boolean> {
    return this.store.select(selectGenerateVideoState).pipe(
      map((state) => state.generating),
      takeUntil(this.destroy$)
    );
  }

  ngOnDestroy(): void {
    this.destroy$.next();
    this.destroy$.complete();
  }
}

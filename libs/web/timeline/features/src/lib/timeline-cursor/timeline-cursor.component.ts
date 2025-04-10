import { CommonModule } from '@angular/common';
import { ChangeDetectionStrategy, Component, OnDestroy } from '@angular/core';
import { ITimelineCursor, ITimelineState } from '@ever-co/shared-utils';
import { selectTimelineState } from '@ever-co/timeline-data-access';
import { Store } from '@ngrx/store';
import {
  distinctUntilChanged,
  map,
  Observable,
  Subject,
  take,
  takeUntil,
} from 'rxjs';

@Component({
    selector: 'lib-timeline-cursor',
    imports: [CommonModule],
    templateUrl: './timeline-cursor.component.html',
    styleUrl: './timeline-cursor.component.scss',
    changeDetection: ChangeDetectionStrategy.OnPush
})
export class TimelineCursorComponent implements OnDestroy {
  private readonly destroy$ = new Subject<void>();

  constructor(private readonly store: Store) {}

  public get position$(): Observable<number> {
    return this.store
      .select(selectTimelineState)
      .pipe(
        map(this.compute.bind(this)),
        distinctUntilChanged(),
        takeUntil(this.destroy$)
      );
  }

  private compute({ cursor, track }: ITimelineState): number {
    const offset =
      ((track.config.frame.width + cursor.width) * 100) /
      (track.config.track.width * 2);
    const position = cursor.position + offset;
    return Math.max(offset, Math.min(100 - offset, position));
  }

  private get cursor$(): Observable<ITimelineCursor> {
    return this.store.select(selectTimelineState).pipe(
      map(({ cursor }) => cursor),
      distinctUntilChanged(),
      takeUntil(this.destroy$)
    );
  }

  public get width$(): Observable<number> {
    return this.cursor$.pipe(
      take(1),
      map(({ width }) => width),
      takeUntil(this.destroy$)
    );
  }

  public get height$(): Observable<number> {
    return this.cursor$.pipe(
      take(1),
      map(({ height }) => height),
      takeUntil(this.destroy$)
    );
  }

  public ngOnDestroy(): void {
    this.destroy$.next();
    this.destroy$.complete();
  }
}

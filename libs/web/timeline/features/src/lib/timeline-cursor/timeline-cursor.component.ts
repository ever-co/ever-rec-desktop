import { CommonModule } from '@angular/common';
import { ChangeDetectionStrategy, Component, OnDestroy } from '@angular/core';
import { selectVideoRemoteControlState } from '@ever-co/convert-video-data-access';
import { Store } from '@ngrx/store';
import { map, Observable, Subject, takeUntil } from 'rxjs';

@Component({
  selector: 'lib-timeline-cursor',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './timeline-cursor.component.html',
  styleUrl: './timeline-cursor.component.scss',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class TimelineCursorComponent implements OnDestroy {
  private readonly destroy$ = new Subject<void>();

  constructor(private readonly store: Store) {}

  public get percentage$(): Observable<number> {
    return this.store.select(selectVideoRemoteControlState).pipe(
      map(({ scrollPercentage }) => scrollPercentage),
      takeUntil(this.destroy$)
    );
  }

  public ngOnDestroy(): void {
    this.destroy$.next();
    this.destroy$.complete();
  }
}

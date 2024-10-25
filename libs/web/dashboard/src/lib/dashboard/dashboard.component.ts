import { CommonModule } from '@angular/common';
import { Component, OnDestroy, OnInit } from '@angular/core';
import { MatCardModule } from '@angular/material/card';
import { MatIconModule } from '@angular/material/icon';
import { selectGenerateVideoState } from '@ever-co/convert-video-data-access';
import { VideoGalleryComponent } from '@ever-co/convert-video-feature';
import { selectScreenshotState } from '@ever-co/screenshot-data-access';
import {
  ScreenshotGalleryComponent,
  ScreenshotStatisticComponent,
} from '@ever-co/screenshot-feature';
import { NoDataComponent } from '@ever-co/shared-components';
import { HumanizePipe, selectDatePickerState } from '@ever-co/shared-service';
import {
  selectTimeLogState,
  timeLogActions,
} from '@ever-co/timesheet-data-access';
import { Store } from '@ngrx/store';
import { map, Observable, Subject, takeUntil, tap } from 'rxjs';

@Component({
  selector: 'lib-dashboard',
  standalone: true,
  imports: [
    CommonModule,
    MatCardModule,
    NoDataComponent,
    MatIconModule,
    ScreenshotGalleryComponent,
    VideoGalleryComponent,
    ScreenshotStatisticComponent,
    HumanizePipe,
  ],
  templateUrl: './dashboard.component.html',
  styleUrl: './dashboard.component.scss',
})
export class DashboardComponent implements OnInit, OnDestroy {
  private destroy$ = new Subject<void>();

  constructor(private readonly store: Store) {}

  ngOnInit(): void {
    this.store
      .select(selectDatePickerState)
      .pipe(
        tap((state) =>
          this.store.dispatch(
            timeLogActions.getTimeLogStatistics(state.selectedRange)
          )
        ),
        takeUntil(this.destroy$)
      )
      .subscribe();
  }

  public get range$(): Observable<number> {
    return this.store.select(selectTimeLogState).pipe(
      map((state) => state.statistics.range),
      takeUntil(this.destroy$)
    );
  }

  public get capturing$(): Observable<boolean> {
    return this.store.select(selectScreenshotState).pipe(
      map((state) => state.capturing),
      takeUntil(this.destroy$)
    );
  }
  public get generating$(): Observable<boolean> {
    return this.store.select(selectGenerateVideoState).pipe(
      map((state) => state.generating),
      takeUntil(this.destroy$)
    );
  }
  public get screenshotCount$(): Observable<number> {
    return this.store.select(selectScreenshotState).pipe(
      map((state) => state.count),
      takeUntil(this.destroy$)
    );
  }
  public get videoCount$(): Observable<number> {
    return this.store.select(selectGenerateVideoState).pipe(
      map((state) => state.count),
      takeUntil(this.destroy$)
    );
  }

  ngOnDestroy(): void {
    this.destroy$.next();
    this.destroy$.complete();
  }
}

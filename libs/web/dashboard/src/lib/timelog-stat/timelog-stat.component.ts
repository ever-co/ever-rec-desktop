import { CommonModule } from '@angular/common';
import { Component, OnDestroy, OnInit } from '@angular/core';
import { MatCardModule } from '@angular/material/card';
import { MatIconModule } from '@angular/material/icon';
import { MatTooltipModule } from '@angular/material/tooltip';
import { selectScreenshotState } from '@ever-co/screenshot-data-access';
import { HumanizeDateRangePipe, HumanizePipe, selectDatePickerState } from '@ever-co/shared-service';
import { IRange, ITimeLogStatistics } from '@ever-co/shared-utils';
import {
  selectTimeLogState,
  timeLogActions,
} from '@ever-co/timesheet-data-access';
import { Store } from '@ngrx/store';
import { map, Observable, Subject, takeUntil, tap } from 'rxjs';

@Component({
  selector: 'lib-timelog-stat',
  standalone: true,
  imports: [
    CommonModule,
    MatCardModule,
    MatIconModule,
    HumanizePipe,
    HumanizeDateRangePipe,
    MatTooltipModule
  ],
  templateUrl: './timelog-stat.component.html',
  styleUrl: './timelog-stat.component.scss',
})
export class TimeLogStaComponent implements OnInit, OnDestroy {
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

  public get statistics$(): Observable<ITimeLogStatistics> {
    return this.store.select(selectTimeLogState).pipe(
      map((state) => state.statistics),
      takeUntil(this.destroy$)
    );
  }

  public get dateRange$(): Observable<IRange> {
    return this.store.select(selectDatePickerState).pipe(
      map((state) => state.selectedRange),
      takeUntil(this.destroy$)
    );
  }

  public get capturing$(): Observable<boolean> {
    return this.store.select(selectScreenshotState).pipe(
      map((state) => state.capturing),
      takeUntil(this.destroy$)
    );
  }

  ngOnDestroy(): void {
    this.destroy$.next();
    this.destroy$.complete();
  }
}

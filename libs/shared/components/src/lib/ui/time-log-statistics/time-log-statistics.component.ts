import { CommonModule } from '@angular/common';
import { Component, OnDestroy, OnInit } from '@angular/core';
import { MatIconModule } from '@angular/material/icon';
import { HumanizePipe, selectDatePickerState } from '@ever-co/shared-service';
import { ITimeLogStatistics } from '@ever-co/shared-utils';
import {
  selectTimeLogState,
  timeLogActions,
} from '@ever-co/timesheet-data-access';
import { selectSettingStorageState } from '@ever-co/web-setting-data-access';
import { Store } from '@ngrx/store';
import { map, Observable, Subject, takeUntil, tap } from 'rxjs';

@Component({
  selector: 'lib-timelog-statistics',
  imports: [CommonModule, MatIconModule, HumanizePipe],
  templateUrl: './time-log-statistics.component.html',
  styleUrl: './time-log-statistics.component.scss',
})
export class TimeLogStatisticsComponent implements OnInit, OnDestroy {
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

  public get showMonth$(): Observable<boolean> {
    return this.store.select(selectSettingStorageState).pipe(
      map(({ retention }) => retention > 7 || retention === -1),
      takeUntil(this.destroy$)
    );
  }

  ngOnDestroy(): void {
    this.destroy$.next();
    this.destroy$.complete();
  }
}

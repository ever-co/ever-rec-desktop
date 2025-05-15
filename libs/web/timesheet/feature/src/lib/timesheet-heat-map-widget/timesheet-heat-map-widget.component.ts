import { CommonModule } from '@angular/common';
import {
  ChangeDetectionStrategy,
  Component,
  OnDestroy,
  OnInit,
} from '@angular/core';
import { selectDateRange } from '@ever-co/date-picker-data-access';
import { NoDataComponent } from '@ever-co/shared-components';
import { isDeepEqual, ITimeLog } from '@ever-co/shared-utils';
import {
  selectHeatMapLogs,
  timeLogActions,
} from '@ever-co/timesheet-data-access';
import { TimesheetHeatMapComponent } from '@ever-co/timesheet-ui';
import { Store } from '@ngrx/store';
import {
  distinctUntilChanged,
  Observable,
  Subject,
  takeUntil,
  tap,
} from 'rxjs';

@Component({
  selector: 'lib-timesheet-heat-map-widget',
  imports: [CommonModule, TimesheetHeatMapComponent, NoDataComponent],
  templateUrl: './timesheet-heat-map-widget.component.html',
  styleUrl: './timesheet-heat-map-widget.component.scss',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class TimesheetHeatMapWidgetComponent implements OnInit, OnDestroy {
  private readonly destroy$ = new Subject<void>();

  constructor(private readonly store: Store) {}

  ngOnInit(): void {
    this.store
      .select(selectDateRange)
      .pipe(
        tap((range) =>
          this.store.dispatch(timeLogActions.getTimeLogHeatMap({ range })),
        ),
        takeUntil(this.destroy$),
      )
      .subscribe();
  }

  public get timeHeatMapLogs$(): Observable<ITimeLog[]> {
    return this.store
      .select(selectHeatMapLogs)
      .pipe(distinctUntilChanged(isDeepEqual), takeUntil(this.destroy$));
  }

  ngOnDestroy(): void {
    this.destroy$.next();
    this.destroy$.complete();
  }
}

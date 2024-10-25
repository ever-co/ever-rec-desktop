import { CommonModule } from '@angular/common';
import { Component, OnDestroy, OnInit, ViewChild } from '@angular/core';
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';
import { MatPaginator, MatPaginatorModule } from '@angular/material/paginator';
import { MatProgressSpinnerModule } from '@angular/material/progress-spinner';
import { MatSort, MatSortModule } from '@angular/material/sort';
import { MatTableDataSource, MatTableModule } from '@angular/material/table';
import { NoDataComponent, selectDatePickerState } from '@ever-co/shared-components';
import { HumanizePipe } from '@ever-co/shared-service';
import { IPaginationOptions, IRange, ITimeLog } from '@ever-co/shared-utils';
import {
  selectTimeLogState,
  timeLogActions,
} from '@ever-co/timesheet-data-access';
import { Store } from '@ngrx/store';
import { Subject, takeUntil, tap } from 'rxjs';

@Component({
  selector: 'lib-timesheet-feature',
  standalone: true,
  imports: [
    CommonModule,
    MatTableModule,
    MatPaginatorModule,
    MatSortModule,
    MatIconModule,
    MatButtonModule,
    MatProgressSpinnerModule,
    HumanizePipe,
    NoDataComponent
  ],
  templateUrl: './timesheet.component.html',
  styleUrl: './timesheet.component.scss',
})
export class TimesheetComponent implements OnInit, OnDestroy {
  displayedColumns: string[] = [
    'start',
    'end',
    'duration',
    'type',
    'running',
    'synced',
  ];
  dataSource = new MatTableDataSource<ITimeLog>([]);
  public loading = false;
  public pageSize = 10;
  public count = 0;
  private destroy$ = new Subject<void>();
  private range!: IRange;

  @ViewChild(MatPaginator) paginator!: MatPaginator;
  @ViewChild(MatSort) sort!: MatSort;

  constructor(private readonly store: Store) {}

  ngOnInit() {
    this.store
      .select(selectTimeLogState)
      .pipe(
        tap((state) => {
          this.count = state.count;
          this.dataSource.data = state.timeLogs;
          this.loading = state.loading;
          console.log(state);
        }),
        takeUntil(this.destroy$)
      )
      .subscribe();

    this.store
      .select(selectDatePickerState)
      .pipe(
        tap((state) => {
          this.range = state.selectedRange;
        }),
        takeUntil(this.destroy$)
      )
      .subscribe();
    this.loadTimeLogs();
  }

  public loadTimeLogs(pageIndex = 0, pageSize = 10) {
    const params = {
      page: pageIndex + 1,
      sortField: this.sort?.active || 'start',
      sortOrder: this.sort?.direction?.toUpperCase() || 'DESC',
      limit: pageSize,
      ...this.range,
    } as IPaginationOptions;
    this.store.dispatch(timeLogActions.loadTimeLogs(params));
  }

  public onPaginateChange(event: any) {
    this.loadTimeLogs(event.pageIndex, event.pageSize);
  }

  ngOnDestroy(): void {
    this.destroy$.next();
    this.destroy$.complete();
  }
}

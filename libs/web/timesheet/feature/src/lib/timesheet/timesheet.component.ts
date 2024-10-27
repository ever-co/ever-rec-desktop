import { CommonModule } from '@angular/common';
import { Component, OnDestroy, OnInit, ViewChild } from '@angular/core';
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';
import { MatPaginator, MatPaginatorModule } from '@angular/material/paginator';
import { MatProgressSpinnerModule } from '@angular/material/progress-spinner';
import { MatSort, MatSortModule } from '@angular/material/sort';
import { MatTableDataSource, MatTableModule } from '@angular/material/table';
import {
  ActionButtonGroupComponent,
  NoDataComponent,
} from '@ever-co/shared-components';
import {
  HumanizePipe,
  LayoutService,
  PopoverDirective,
  selectDatePickerState,
} from '@ever-co/shared-service';
import {
  IActionButton,
  IPaginationOptions,
  IRange,
  ITimeLog,
} from '@ever-co/shared-utils';
import {
  selectTimeLogState,
  timeLogActions,
} from '@ever-co/timesheet-data-access';
import { Store } from '@ngrx/store';
import { map, Observable, Subject, takeUntil, tap } from 'rxjs';

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
    NoDataComponent,
    ActionButtonGroupComponent,
    PopoverDirective,
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
  private selectedRow: ITimeLog | null = null;
  public actionButtons: IActionButton[] = [
    {
      'label': 'Edit',
      'icon':'edit'
    },
    {
      icon: 'delete',
      label: 'Delete',
      variant: 'danger',
      hide: this.hideAction$,
      action: this.delete.bind(this),
    },
  ];

  @ViewChild(MatPaginator) paginator!: MatPaginator;
  @ViewChild(MatSort) sort!: MatSort;

  constructor(
    private readonly store: Store,
    private readonly layoutService: LayoutService
  ) {}

  ngOnInit() {
    this.store
      .select(selectTimeLogState)
      .pipe(
        tap((state) => {
          this.count = state.count;
          this.dataSource.data = state.timeLogs;
          this.loading = state.loading;
        }),
        takeUntil(this.destroy$)
      )
      .subscribe();

    this.store
      .select(selectDatePickerState)
      .pipe(
        tap((state) => {
          this.range = state.selectedRange;
          this.loadTimeLogs(0, this.pageSize);
        }),
        takeUntil(this.destroy$)
      )
      .subscribe();
  }

  public loadTimeLogs(pageIndex = 0, pageSize = 10) {
    const params: IPaginationOptions = {
      page: pageIndex + 1,
      sortField: this.sort?.active || 'start',
      sortOrder: this.sort?.direction?.toUpperCase() || 'DESC',
      limit: pageSize,
      ...this.range,
    } as IPaginationOptions;

    pageSize = this.pageSize;

    this.store.dispatch(timeLogActions.loadTimeLogs(params));
  }

  public onPaginateChange(event: any) {
    this.loadTimeLogs(event.pageIndex, event.pageSize);
  }

  public select(log: ITimeLog): void {
    const timeLog = (this.selectedRow?.id === log.id ? null : log) as ITimeLog;
    this.store.dispatch(timeLogActions.loadTimeLogSuccess({ timeLog }));
  }

  public sortChange(): void {
    this.loadTimeLogs(0, this.pageSize);
  }

  public delete(): void {
    if (!this.selectedRow) return;
    this.store.dispatch(
      timeLogActions.deleteTimeLog({ timeLog: this.selectedRow })
    );
  }

  public get selectedRow$(): Observable<ITimeLog> {
    return this.store.select(selectTimeLogState).pipe(
      map((state) => {
        this.selectedRow = state.timeLog;
        return this.selectedRow;
      })
    );
  }

  public get isMobileView() {
    return this.layoutService.isMobileView;
  }

  public get hideAction$(): Observable<boolean> {
    return this.store
      .select(selectTimeLogState)
      .pipe(map((state) => (state.timeLog?.id ? false : true)));
  }

  ngOnDestroy(): void {
    this.destroy$.next();
    this.destroy$.complete();
  }
}

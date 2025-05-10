import { Clipboard } from '@angular/cdk/clipboard';
import { CommonModule } from '@angular/common';
import { Component, inject, OnDestroy, OnInit, ViewChild } from '@angular/core';
import { MatButtonModule } from '@angular/material/button';
import { MatDialog } from '@angular/material/dialog';
import { MatIconModule } from '@angular/material/icon';
import { MatPaginator, MatPaginatorModule } from '@angular/material/paginator';
import { MatProgressSpinnerModule } from '@angular/material/progress-spinner';
import { MatSort, MatSortModule } from '@angular/material/sort';
import { MatTableDataSource, MatTableModule } from '@angular/material/table';
import { MatTooltipModule } from '@angular/material/tooltip';
import {
  generateVideoActions,
  selectGenerateVideoState,
  selectSettingState,
} from '@ever-co/convert-video-data-access';
import { NotificationService } from '@ever-co/notification-data-access';
import {
  ActionButtonGroupComponent,
  ConfirmationDialogService,
  NoDataComponent,
  TimeLogStatisticsComponent,
} from '@ever-co/shared-components';
import {
  HumanizeDateRangePipe,
  HumanizePipe,
  LayoutService,
  PopoverDirective,
} from '@ever-co/shared-service';
import {
  IActionButton,
  IPaginationOptions,
  IRange,
  ITimeLog,
  ITimeLogStatistics,
} from '@ever-co/shared-utils';
import {
  selectTimeLogState,
  timeLogActions,
} from '@ever-co/timesheet-data-access';
import { Store } from '@ngrx/store';
import {
  concatMap,
  debounceTime,
  exhaustMap,
  filter,
  map,
  Observable,
  Subject,
  take,
  takeUntil,
  tap,
  withLatestFrom,
} from 'rxjs';
import { TimesheetViewComponent } from '../timesheet-view/timesheet-view.component';
import { ActivatedRoute } from '@angular/router';
import { selectDateRange } from '@ever-co/date-picker-data-access';

@Component({
  selector: 'lib-timesheet-feature',
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
    HumanizeDateRangePipe,
    PopoverDirective,
    MatTooltipModule,
  ],
  templateUrl: './timesheet.component.html',
  styleUrl: './timesheet.component.scss',
})
export class TimesheetComponent implements OnInit, OnDestroy {
  displayedColumns: string[] = [
    'createdAt',
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
  private readonly store = inject(Store);
  public actionButtons: IActionButton[] = [
    {
      icon: 'content_copy',
      tooltip: 'Copy all time logs context to clipboard',
      variant: 'default',
      hide: this.hideAction$.pipe(map((hidden) => !hidden)),
      action: this.getAllContext.bind(this),
      loading: this.copying$,
    },
    {
      icon: 'content_copy',
      label: 'Summary',
      variant: 'default',
      hide: this.hideAction$,
      action: this.getContext.bind(this),
      loading: this.copying$,
      tooltip: 'Get context from selected timeline',
    },
    {
      icon: 'visibility',
      label: 'View',
      variant: 'warning',
      hide: this.hideAction$,
      tooltip: 'View and Generate a video from this selected timeline',
      action: this.generateVideo.bind(this),
      loading: this.generating$,
      disable: this.isRunning$.pipe(
        withLatestFrom(this.generating$),
        map(([isRunning, generating]) => isRunning || generating),
      ),
    },
    {
      icon: 'delete',
      label: 'Delete',
      variant: 'danger',
      hide: this.hideAction$,
      action: this.delete.bind(this),
      disable: this.isRunning$,
      tooltip: 'Delete selected timeline',
    },
  ];

  @ViewChild(MatPaginator) paginator!: MatPaginator;
  @ViewChild(MatSort) sort!: MatSort;

  constructor(
    private readonly layoutService: LayoutService,
    private readonly confirmationDialogService: ConfirmationDialogService,
    private readonly clipboard: Clipboard,
    private readonly matDialog: MatDialog,
    private readonly notificationService: NotificationService,
    private readonly route: ActivatedRoute,
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
        takeUntil(this.destroy$),
      )
      .subscribe();

    this.store
      .select(selectTimeLogState)
      .pipe(
        map(({ context }) => context),
        filter(Boolean),
        // Use exhaustMap to ignore new emissions while dialog is open
        exhaustMap((context) =>
          this.confirmationDialogService
            .open({
              title: 'Summary',
              message: context,
              variant: 'primary',
              button: {
                confirm: {
                  variant: 'default',
                  icon: 'copy',
                  label: 'Copy',
                },
              },
            })
            .pipe(
              // Reset context regardless of confirmation result
              tap({
                finalize: () => {
                  this.store.dispatch(timeLogActions.resetTimeLogContext());
                },
              }),
              // Only proceed with copy if confirmed
              filter(Boolean),
              tap(() => {
                this.clipboard.copy(context);
                this.notificationService.show(
                  'Copied time log context to clipboard',
                  'success',
                );
              }),
            ),
        ),
        takeUntil(this.destroy$),
      )
      .subscribe();

    this.store
      .select(selectDateRange)
      .pipe(
        tap((range) => {
          this.range = range;
          this.store.dispatch(timeLogActions.getTimeLogStatistics(range));
          this.loadTimeLogs(0, this.pageSize);
        }),
        takeUntil(this.destroy$),
      )
      .subscribe();

    this.route.queryParams
      .pipe(
        map(({ timeLogId }) => timeLogId),
        filter(Boolean),
        tap((timeLogId) => this.select({ id: timeLogId } as ITimeLog)),
        debounceTime(300),
        tap(() => this.generateVideo()),
        takeUntil(this.destroy$),
      )
      .subscribe();
  }

  public loadTimeLogs(pageIndex = 0, pageSize = 10) {
    const params = {
      page: pageIndex + 1,
      sortField: this.sort?.active || 'start',
      sortOrder: this.sort?.direction?.toUpperCase() || 'DESC',
      limit: pageSize,
      ...this.range,
    } as IPaginationOptions<ITimeLog>;

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
    this.confirmationDialogService
      .open({
        title: 'Delete Time Log',
        message: `Are you sure you want to delete this time log?`,
        variant: 'danger',
      })
      .pipe(
        take(1),
        filter(Boolean),
        map(() => this.selectedRow),
        filter(Boolean),
        tap((timeLog) =>
          this.store.dispatch(timeLogActions.deleteTimeLog({ timeLog })),
        ),
        takeUntil(this.destroy$),
      )
      .subscribe();
  }

  public get selectedRow$(): Observable<ITimeLog> {
    return this.store.select(selectTimeLogState).pipe(
      map((state) => {
        this.selectedRow = state.timeLog;
        return this.selectedRow;
      }),
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

  public get dateRange$(): Observable<IRange> {
    return this.store.select(selectDateRange).pipe(takeUntil(this.destroy$));
  }

  public get timeLogStatisticsComponent() {
    return TimeLogStatisticsComponent;
  }

  public get statistics$(): Observable<ITimeLogStatistics> {
    return this.store.select(selectTimeLogState).pipe(
      map((state) => state.statistics),
      takeUntil(this.destroy$),
    );
  }

  private generateVideo(): void {
    const timeLogId = this.selectedRow?.id;

    if (!timeLogId) {
      return;
    }

    this.confirmationDialogService
      .open({
        title: 'View Timeline',
        message: `Are you sure you want to generate a video for this time log?`,
        variant: 'warning',
        button: {
          confirm: {
            variant: 'warning',
            icon: 'visibility',
            label: 'View',
          },
        },
      })
      .pipe(
        take(1),
        filter(Boolean),
        withLatestFrom(this.store.select(selectSettingState)),
        tap(([, { videoConfig: config }]) =>
          this.store.dispatch(
            generateVideoActions.start({ timeLogId, config, isTimeLine: true }),
          ),
        ),
        concatMap(() =>
          this.matDialog.open(TimesheetViewComponent).afterClosed(),
        ),
        takeUntil(this.destroy$),
      )
      .subscribe();
  }

  private get generating$(): Observable<boolean> {
    return this.store.select(selectGenerateVideoState).pipe(
      map((state) => state.generating),
      takeUntil(this.destroy$),
    );
  }

  private get isRunning$(): Observable<boolean> {
    return this.store.select(selectTimeLogState).pipe(
      map(({ timeLog }) => timeLog?.running),
      takeUntil(this.destroy$),
    );
  }

  private getContext(timeLog: ITimeLog): void {
    this.store.dispatch(timeLogActions.getTimeLogContext(timeLog));
  }

  private getAllContext(): void {
    this.dateRange$
      .pipe(
        take(1),
        tap((range) =>
          this.store.dispatch(timeLogActions.getTimeLogContext({ range })),
        ),
      )
      .subscribe();
  }

  private get copying$(): Observable<boolean> {
    return this.store
      .select(selectTimeLogState)
      .pipe(map((state) => state.copying));
  }

  ngOnDestroy(): void {
    this.destroy$.next();
    this.destroy$.complete();
  }
}

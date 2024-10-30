import { CommonModule } from '@angular/common';
import { Component, OnDestroy, OnInit, inject } from '@angular/core';
import { MatCardModule } from '@angular/material/card';
import { MatProgressSpinnerModule } from '@angular/material/progress-spinner';
import { Router, RouterLink } from '@angular/router';
import {
  screenshotActions,
  selectScreenshotState,
} from '@ever-co/screenshot-data-access';
import {
  ActionButtonGroupComponent,
  NoDataComponent,
  ScreenshotComponent,
} from '@ever-co/shared-components';
import {
  InfiniteScrollDirective,
  UtcToLocalTimePipe,
  selectDatePickerState,
} from '@ever-co/shared-service';
import {
  IActionButton,
  IRange,
  IScreenshot,
  ISelected,
} from '@ever-co/shared-utils';
import { Store } from '@ngrx/store';
import {
  BehaviorSubject,
  Observable,
  Subject,
  map,
  takeUntil,
  tap,
} from 'rxjs';

@Component({
  selector: 'lib-screenshot-gallery',
  standalone: true,
  imports: [
    CommonModule,
    InfiniteScrollDirective,
    UtcToLocalTimePipe,
    NoDataComponent,
    MatCardModule,
    MatProgressSpinnerModule,
    RouterLink,
    ScreenshotComponent,
    ActionButtonGroupComponent,
  ],
  templateUrl: './screenshot-gallery.component.html',
  styleUrl: './screenshot-gallery.component.scss',
})
export class ScreenshotGalleryComponent implements OnInit, OnDestroy {
  public screenshots$ = new Observable<IScreenshot[]>();
  public capturing$ = new Observable<boolean>();
  private destroy$ = new Subject<void>();
  public isAvailable$ = new Observable<boolean>();
  public store = inject(Store);
  private currentPage = 1;
  private hasNext = false;
  private range!: IRange;
  public _selectedScreenshots$ = new BehaviorSubject<ISelected<IScreenshot>[]>(
    []
  );
  public actionButtons: IActionButton[] = [
    {
      icon: 'visibility',
      label: 'View',
      variant: 'default',
      hide: this.moreThanOneSelected$,
      action: this.view.bind(this),
    },
    {
      icon: 'videocam',
      label: 'Generate',
      variant: 'warning',
      hide: this.lessThanOneSelected$,
    },
    {
      icon: 'delete',
      label: 'Delete',
      variant: 'danger',
      loading: this.deleting$,
      action: this.deleteScreenshots.bind(this),
    },
  ];

  constructor(private readonly router: Router) {}

  ngOnInit(): void {
    this.store
      .select(selectScreenshotState)
      .pipe(
        tap((state) => {
          this.hasNext = state.hasNext;
        }),
        takeUntil(this.destroy$)
      )
      .subscribe();
    this.isAvailable$ = this.store.select(selectScreenshotState).pipe(
      map((state) => state.count > 0),
      takeUntil(this.destroy$)
    );

    this.capturing$ = this.store.select(selectScreenshotState).pipe(
      map((state) => state.capturing || state.loading),
      takeUntil(this.destroy$)
    );

    this.screenshots$ = this.store.select(selectScreenshotState).pipe(
      map((state) => state.screenshots),
      takeUntil(this.destroy$)
    );
    this.store
      .select(selectDatePickerState)
      .pipe(
        tap((state) => {
          this.range = state.selectedRange;
          this.currentPage = 1;
          this.store.dispatch(screenshotActions.resetScreenshots());
          this.loadScreenshots();
        }),
        takeUntil(this.destroy$)
      )
      .subscribe();
  }

  public moreScreenshots(): void {
    if (this.hasNext) {
      this.currentPage++;
      this.loadScreenshots();
    }
  }

  public loadScreenshots(): void {
    this.store.dispatch(
      screenshotActions.loadScreenshots({
        page: this.currentPage,
        ...this.range,
      })
    );
  }

  public selectScreenshot(screenshot: ISelected<IScreenshot>): void {
    this.selectedScreenshots = [
      ...new Map(
        [...this.selectedScreenshots, screenshot].map((item) => [
          item.data.id,
          item,
        ])
      ).values(),
    ].filter((item) => item.selected);
  }

  public get selectedScreenshots(): ISelected<IScreenshot>[] {
    return this._selectedScreenshots$.getValue();
  }

  public set selectedScreenshots(values: ISelected<IScreenshot>[]) {
    this._selectedScreenshots$.next(values);
  }

  public get selectedScreenshots$(): Observable<ISelected<IScreenshot>[]> {
    return this._selectedScreenshots$
      .asObservable()
      .pipe(takeUntil(this.destroy$));
  }

  public get moreThanOneSelected$(): Observable<boolean> {
    return this.selectedScreenshots$.pipe(
      map((screenshots) => screenshots.length > 1)
    );
  }

  public get lessThanOneSelected$(): Observable<boolean> {
    return this.selectedScreenshots$.pipe(
      map((screenshots) => screenshots.length <= 1)
    );
  }

  public get size$(): Observable<number> {
    return this.selectedScreenshots$.pipe(
      map((screenshots) => screenshots.length)
    );
  }

  private async view(): Promise<void> {
    await this.router.navigate([
      '/',
      'library',
      'screenshots',
      this.selectedScreenshots[0].data.id,
    ]);
  }

  private deleteScreenshots(): void {
    const screenshots = this.selectedScreenshots.map((item) => item.data);
     this.store.dispatch(
      screenshotActions.deleteSelectedScreenshots({ screenshots })
    );
  }

  public get deleting$(): Observable<boolean> {
    return this.store.select(selectScreenshotState).pipe(
      tap((screenshot) => {
        if (screenshot.deleting) {
          this.selectedScreenshots = [];
        }
      }),
      map((screenshot) => screenshot.deleting),
      takeUntil(this.destroy$)
    );
  }

  ngOnDestroy(): void {
    this.destroy$.next();
    this.destroy$.complete();
  }
}

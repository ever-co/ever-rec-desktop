import { CommonModule } from '@angular/common';
import { Component, OnDestroy, OnInit, inject } from '@angular/core';
import { MatCardModule } from '@angular/material/card';
import { MatProgressSpinnerModule } from '@angular/material/progress-spinner';
import { Router, RouterLink } from '@angular/router';
import {
  generateVideoActions,
  selectGenerateVideoState,
  selectSettingState,
} from '@ever-co/convert-video-data-access';
import {
  screenshotActions,
  selectScreenshotState,
} from '@ever-co/screenshot-data-access';
import {
  GalleryButtonsActionComponent,
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
import { Observable, Subject, filter, map, take, takeUntil, tap } from 'rxjs';

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
    GalleryButtonsActionComponent,
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
  public actionButtons: IActionButton[] = [
    {
      icon: 'visibility',
      label: 'View',
      variant: 'default',
      hide: this.moreThanOneSelected$,
      action: this.view.bind(this),
    },
    {
      icon: 'subscriptions',
      label: 'Generate',
      variant: 'warning',
      hide: this.lessThanOneSelected$,
      action: this.generateVideo.bind(this),
      loading: this.generating$,
    },
    {
      icon: 'remove_done',
      label: 'Unselect All',
      variant: 'default',
      hide: this.lessThanOneSelected$,
      action: this.unselectAll.bind(this),
    },
    {
      icon: 'remove_done',
      label: 'Unselect',
      variant: 'default',
      hide: this.moreThanOneSelected$,
      action: this.unselectAll.bind(this),
    },
    {
      icon: 'delete',
      label: 'Delete',
      variant: 'danger',
      loading: this.deleting$,
      action: this.deleteScreenshots.bind(this),
    },
  ];

  constructor(
    private readonly router: Router
  ) {}

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
    this.store
      .select(selectScreenshotState)
      .pipe(
        filter(({ deleting }) => deleting),
        tap(() => this.unselectAll()),
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
    this.store.dispatch(
      screenshot.selected
        ? screenshotActions.selectScreenshot({ screenshot })
        : screenshotActions.unselectScreenshot({ screenshot })
    );
  }

  public get selectedScreenshots$(): Observable<ISelected<IScreenshot>[]> {
    return this.store.select(selectScreenshotState).pipe(
      map((state) => state.selectedScreenshots),
      takeUntil(this.destroy$)
    );
  }

  public get moreThanOneSelected$(): Observable<boolean> {
    return this.selectedScreenshots$.pipe(
      map((screenshots) => screenshots.length > 1),
      takeUntil(this.destroy$)
    );
  }

  public get lessThanOneSelected$(): Observable<boolean> {
    return this.selectedScreenshots$.pipe(
      map((screenshots) => screenshots.length <= 1),
      takeUntil(this.destroy$)
    );
  }

  public get size$(): Observable<number> {
    return this.selectedScreenshots$.pipe(
      map((screenshots) => screenshots.length),
      takeUntil(this.destroy$)
    );
  }

  private async view(
    selectedScreenshots: ISelected<IScreenshot>[]
  ): Promise<void> {
    const screenshotId = selectedScreenshots[0].data.id;
    await this.router.navigate(['/', 'library', 'screenshots', screenshotId]);
    this.store.dispatch(
      screenshotActions.unselectScreenshot({
        screenshot: selectedScreenshots[0],
      })
    );
  }

  private deleteScreenshots(
    selectedScreenshots: ISelected<IScreenshot>[]
  ): void {
    const screenshots = selectedScreenshots.map(
      (screenshot) => screenshot.data
    );
    this.store.dispatch(
      screenshotActions.deleteSelectedScreenshots({ screenshots })
    );
  }

  private generateVideo(selectedScreenshots: ISelected<IScreenshot>[]): void {
    const screenshotIds = selectedScreenshots.map(
      (screenshot) => screenshot.data.id
    );
    this.store
      .select(selectSettingState)
      .pipe(
        take(1),
        tap(({ videoConfig: config }) =>
          this.store.dispatch(
            generateVideoActions.start({ screenshotIds, config })
          )
        )
      )
      .subscribe();
  }

  private get generating$(): Observable<boolean> {
    return this.store.select(selectGenerateVideoState).pipe(
      map((state) => state.generating),
      takeUntil(this.destroy$)
    );
  }

  public get deleting$(): Observable<boolean> {
    return this.store.select(selectScreenshotState).pipe(
      map((screenshot) => screenshot.deleting),
      takeUntil(this.destroy$)
    );
  }

  public isSelected(screenshot: IScreenshot): Observable<boolean> {
    return this.selectedScreenshots$.pipe(
      map((selectedScreenshots) =>
        selectedScreenshots.some((v) => v.data.id === screenshot.id)
      ),
      takeUntil(this.destroy$)
    );
  }

  public unselectAll(): void {
    this.store.dispatch(screenshotActions.unselectAllScreenshots());
  }

  ngOnDestroy(): void {
    this.destroy$.next();
    this.destroy$.complete();
  }
}

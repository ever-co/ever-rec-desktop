import { CommonModule } from '@angular/common';
import { Component, OnDestroy, OnInit } from '@angular/core';
import { MatCardModule } from '@angular/material/card';
import { MatProgressSpinnerModule } from '@angular/material/progress-spinner';
import { Router } from '@angular/router';
import { breadcrumbActions } from '@ever-co/breadcrumb-data-access';
import {
  generateVideoActions,
  selectGenerateVideoState,
  selectGenerateVideoConfig,
} from '@ever-co/generate-video-data-access';
import {
  screenshotActions,
  selectScreenshotState,
} from '@ever-co/screenshot-data-access';
import { ScreenshotComponent } from '@ever-co/screenshot-ui';
import {
  ConfirmationDialogService,
  GalleryButtonsActionComponent,
  NoDataComponent,
} from '@ever-co/shared-components';
import { InfiniteScrollDirective } from '@ever-co/shared-service';
import { IActionButton, IScreenshot, ISelected } from '@ever-co/shared-utils';
import {
  selectUploadInProgress,
  uploadActions,
  UploadScreenshotItem,
} from '@ever-co/upload-data-access';
import { selectSettingStorageState } from '@ever-co/web-setting-data-access';
import { Store } from '@ngrx/store';
import {
  filter,
  map,
  Observable,
  Subject,
  take,
  takeUntil,
  tap,
  withLatestFrom,
} from 'rxjs';

@Component({
  selector: 'lib-screenshot-search',
  imports: [
    CommonModule,
    InfiniteScrollDirective,
    NoDataComponent,
    MatCardModule,
    MatProgressSpinnerModule,
    ScreenshotComponent,
    GalleryButtonsActionComponent,
  ],
  templateUrl: './screenshot-search.component.html',
  styleUrl: './screenshot-search.component.scss',
})
export class ScreenshotSearchComponent implements OnInit, OnDestroy {
  public screenshots$!: Observable<IScreenshot[]>;
  public capturing$!: Observable<boolean>;
  private destroy$ = new Subject<void>();
  public isAvailable$!: Observable<boolean>;
  public count$!: Observable<number>;
  private currentPage = 1;
  private hasNext = false;
  public filter = '';
  public readonly galleryButtons: IActionButton[] = [];
  public readonly cardButtons: IActionButton[] = [];
  private readonly commonsButtons: IActionButton[] = [
    {
      icon: 'backup',
      label: 'Upload',
      variant: 'success',
      action: this.upload.bind(this),
      loading: this.uploading$,
      loadingLabel: 'Uploading...',
      hide: this.isUploadHidden$,
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
    private readonly router: Router,
    private readonly store: Store,
    private readonly confirmationDialogService: ConfirmationDialogService,
  ) {
    this.cardButtons = [
      {
        icon: 'visibility',
        label: 'View',
        variant: 'default',
        action: this.view.bind(this),
      },
      ...this.commonsButtons,
    ];

    this.galleryButtons = [
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
      ...this.commonsButtons,
    ];
  }

  ngOnInit(): void {
    this.store
      .select(selectScreenshotState)
      .pipe(
        tap((state) => {
          this.hasNext = state.search.hasNext;
          this.filter = state.search.filter;
        }),
        takeUntil(this.destroy$),
      )
      .subscribe();
    this.isAvailable$ = this.store.select(selectScreenshotState).pipe(
      map((state) => state.search.count > 0),
      takeUntil(this.destroy$),
    );

    this.count$ = this.store.select(selectScreenshotState).pipe(
      map((state) => state.search.count),
      takeUntil(this.destroy$),
    );

    this.capturing$ = this.store.select(selectScreenshotState).pipe(
      map((state) => state.capturing || state.search.loading),
      takeUntil(this.destroy$),
    );

    this.screenshots$ = this.store.select(selectScreenshotState).pipe(
      map((state) => state.search.screenshots),
      takeUntil(this.destroy$),
    );
    this.store
      .select(selectScreenshotState)
      .pipe(
        filter(({ deleting }) => deleting),
        tap(() => this.unselectAll()),
        takeUntil(this.destroy$),
      )
      .subscribe();
    this.store.dispatch(
      breadcrumbActions.set({
        breadcrumbs: [{ label: 'Search', url: '/search' }],
      }),
    );
  }

  public moreScreenshots(): void {
    if (this.hasNext) {
      this.currentPage++;
      this.loadScreenshots();
    }
  }

  public loadScreenshots(): void {
    this.store.dispatch(
      screenshotActions.ask({
        page: this.currentPage,
        filter: this.filter,
      }),
    );
  }

  public selectScreenshot(screenshot: ISelected<IScreenshot>): void {
    this.store.dispatch(
      screenshot.selected
        ? screenshotActions.selectScreenshot({ screenshot })
        : screenshotActions.unselectScreenshot({ screenshot }),
    );
  }

  public get selectedScreenshots$(): Observable<ISelected<IScreenshot>[]> {
    return this.store.select(selectScreenshotState).pipe(
      map((state) => state.selectedScreenshots),
      takeUntil(this.destroy$),
    );
  }

  public get moreThanOneSelected$(): Observable<boolean> {
    return this.selectedScreenshots$.pipe(
      map((screenshots) => screenshots.length > 1),
      takeUntil(this.destroy$),
    );
  }

  public get lessThanOneSelected$(): Observable<boolean> {
    return this.selectedScreenshots$.pipe(
      map((screenshots) => screenshots.length <= 1),
      takeUntil(this.destroy$),
    );
  }

  public get size$(): Observable<number> {
    return this.selectedScreenshots$.pipe(
      map((screenshots) => screenshots.length),
      takeUntil(this.destroy$),
    );
  }

  private async view(
    selectedScreenshots: ISelected<IScreenshot>[],
  ): Promise<void> {
    const screenshotId = selectedScreenshots[0].data.id;
    await this.router.navigate(['/', 'library', 'screenshots', screenshotId]);
    this.store.dispatch(
      screenshotActions.unselectScreenshot({
        screenshot: selectedScreenshots[0],
      }),
    );
  }

  private deleteScreenshots(
    selectedScreenshots: ISelected<IScreenshot>[],
  ): void {
    const screenshots = selectedScreenshots.map(
      (screenshot) => screenshot.data,
    );
    this.confirmationDialogService
      .open({
        title: 'Delete Screenshots?',
        message: `Are you sure you want to delete ${screenshots.length} screenshots?`,
        variant: 'danger',
      })
      .pipe(
        take(1),
        filter(Boolean),
        tap(() =>
          this.store.dispatch(
            screenshotActions.deleteSelectedScreenshots({ screenshots }),
          ),
        ),
        takeUntil(this.destroy$),
      )
      .subscribe();
  }

  private generateVideo(selectedScreenshots: ISelected<IScreenshot>[]): void {
    const screenshotIds = selectedScreenshots.map(
      (screenshot) => screenshot.data.id,
    );
    this.confirmationDialogService
      .open({
        title: 'Generate Video',
        message: `Are you sure you want to generate a video from ${screenshotIds.length} screenshots?`,
        variant: 'warning',
        button: {
          confirm: {
            label: 'Generate',
            variant: 'warning',
            icon: 'subscriptions',
          },
        },
      })
      .pipe(
        take(1),
        filter(Boolean),
        withLatestFrom(this.store.select(selectGenerateVideoConfig)),
        tap(([, config]) =>
          this.store.dispatch(
            generateVideoActions.start({ screenshotIds, config }),
          ),
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

  public get deleting$(): Observable<boolean> {
    return this.store.select(selectScreenshotState).pipe(
      map((screenshot) => screenshot.deleting),
      takeUntil(this.destroy$),
    );
  }

  public isSelected(screenshot: IScreenshot): Observable<boolean> {
    return this.selectedScreenshots$.pipe(
      map((selectedScreenshots) =>
        selectedScreenshots.some((v) => v.data.id === screenshot.id),
      ),
      takeUntil(this.destroy$),
    );
  }

  public unselectAll(): void {
    this.store.dispatch(screenshotActions.unselectAllScreenshots());
  }

  public async onView(screenshot: IScreenshot): Promise<void> {
    await this.router.navigate(['/', 'library', 'screenshots', screenshot.id]);
  }

  private get isUploadHidden$(): Observable<boolean> {
    return this.store.select(selectSettingStorageState).pipe(
      map(({ uploadConfig }) => !uploadConfig.manualSync),
      takeUntil(this.destroy$),
    );
  }

  private get uploading$(): Observable<boolean> {
    return this.store
      .select(selectUploadInProgress)
      .pipe(takeUntil(this.destroy$));
  }

  private upload(selectedScreenshots: ISelected<IScreenshot>[]): void {
    const size = selectedScreenshots.length;
    const s = size > 1 ? 's' : '';
    this.confirmationDialogService
      .open({
        title: `Upload Screenshot${s}`,
        message: `Are you sure you want to upload selected screenshot${s}?`,
        variant: 'primary',
        button: {
          confirm: {
            label: `Upload(${size})`,
            variant: 'success',
            icon: 'backup',
          },
        },
      })
      .pipe(
        take(1),
        filter(Boolean),
        tap(() => {
          const items = selectedScreenshots.map(
            ({ data }) => new UploadScreenshotItem(data),
          );
          this.store.dispatch(uploadActions.addItemToQueue({ items }));
        }),
        takeUntil(this.destroy$),
      )
      .subscribe();
  }

  ngOnDestroy(): void {
    this.destroy$.next();
    this.destroy$.complete();
  }
}

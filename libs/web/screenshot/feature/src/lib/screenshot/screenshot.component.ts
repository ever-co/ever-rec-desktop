import { CommonModule, Location } from '@angular/common';
import { Component, Input, OnDestroy, OnInit } from '@angular/core';
import { MatCardModule } from '@angular/material/card';
import { MatChipsModule } from '@angular/material/chips';
import { MatIconModule } from '@angular/material/icon';
import { MatTooltipModule } from '@angular/material/tooltip';
import { ActivatedRoute, Router } from '@angular/router';
import {
  screenshotActions,
  selectScreenshotState,
} from '@ever-co/screenshot-data-access';
import {
  ActionButtonGroupComponent,
  ConfirmationDialogService,
  NoDataComponent,
  VideoComponent,
} from '@ever-co/shared-components';
import {
  CopyToClipboardDirective,
  HumanizeBytesPipe,
  IconFallbackDirective,
  ImgFallbackDirective,
  PopoverDirective,
  UtcToLocalTimePipe,
} from '@ever-co/shared-service';
import { IActionButton, IScreenshot } from '@ever-co/shared-utils';
import {
  selectUploadInProgress,
  uploadActions,
  UploadScreenshotItem,
} from '@ever-co/upload-data-access';
import { selectSettingStorageState } from '@ever-co/web-setting-data-access';
import { Store } from '@ngrx/store';
import {
  concatMap,
  filter,
  lastValueFrom,
  map,
  Observable,
  Subject,
  take,
  takeUntil,
  tap,
} from 'rxjs';

@Component({
  selector: 'lib-screenshot',
  imports: [
    CommonModule,
    NoDataComponent,
    UtcToLocalTimePipe,
    MatCardModule,
    MatIconModule,
    MatChipsModule,
    VideoComponent,
    HumanizeBytesPipe,
    PopoverDirective,
    ActionButtonGroupComponent,
    CopyToClipboardDirective,
    ImgFallbackDirective,
    IconFallbackDirective,
    MatTooltipModule,
  ],
  templateUrl: './screenshot.component.html',
  styleUrl: './screenshot.component.scss',
})
export class ScreenshotComponent implements OnInit, OnDestroy {
  private readonly destroy$ = new Subject<void>();
  public readonly actionButtons: IActionButton[] = [];

  constructor(
    private readonly router: Router,
    private readonly activatedRoute: ActivatedRoute,
    private readonly store: Store,
    private readonly confirmationDialogService: ConfirmationDialogService,
    private readonly location: Location,
  ) {
    this.actionButtons = [
      {
        icon: 'backup',
        label: 'Upload',
        variant: 'success',
        action: this.upload.bind(this),
        loading: this.uploading$,
        loadingLabel: 'Uploading...',
        disable: this.uploading$,
        hide: this.isUploadHidden$,
      },
      {
        icon: 'delete',
        label: 'Delete',
        variant: 'danger',
        action: this.delete.bind(this),
      },
    ];
  }

  ngOnInit(): void {
    this.activatedRoute.params
      .pipe(
        filter(Boolean),
        concatMap(async (params) => {
          if (params['id']) {
            this.load(params['id']);
          } else {
            await this.router.navigate(['/dashboard']);
          }
        }),
        takeUntil(this.destroy$),
      )
      .subscribe();
  }

  public load(id: string) {
    this.store.dispatch(
      screenshotActions.loadScreenshot({
        options: {
          where: {
            id,
          },
          relations: ['metadata', 'metadata.application', 'video', 'chunks'],
        },
      }),
    );
  }

  public get screenshot$(): Observable<IScreenshot | null> {
    return this.store.select(selectScreenshotState).pipe(
      map((state) => state.screenshot),
      takeUntil(this.destroy$),
    );
  }

  public goBack(): void {
    this.location.back();
  }

  private _data!: IScreenshot | null;

  @Input()
  public get data(): IScreenshot | null {
    return this._data;
  }

  public set data(value: IScreenshot | null) {
    this._data = value;
  }

  public async delete(screenshot: IScreenshot) {
    const isConfirmed = await lastValueFrom(
      this.confirmationDialogService.open({
        title: 'Delete Screenshot',
        message: 'Are you sure you want to delete this screenshot?',
        variant: 'danger',
      }),
    );
    if (isConfirmed) {
      this.store.dispatch(screenshotActions.deleteScreenshot(screenshot));
      await this.router.navigate(['/', 'library', 'screenshots']);
    }
  }

  private upload(screenshot: IScreenshot): void {
    this.confirmationDialogService
      .open({
        title: 'Upload Screenshot',
        message: `Are you sure you want to upload this screenshot?`,
        variant: 'primary',
        button: {
          confirm: {
            label: 'Upload',
            variant: 'success',
            icon: 'backup',
          },
        },
      })
      .pipe(
        take(1),
        filter(Boolean),
        tap(() =>
          this.store.dispatch(
            uploadActions.addItemToQueue({
              item: new UploadScreenshotItem(screenshot),
            }),
          ),
        ),
        takeUntil(this.destroy$),
      )
      .subscribe();
  }

  private get isUploadHidden$(): Observable<boolean> {
    return this.store
      .select(selectSettingStorageState)
      .pipe(map(({ uploadConfig }) => !uploadConfig.manualSync));
  }

  private get uploading$(): Observable<boolean> {
    return this.store
      .select(selectUploadInProgress)
      .pipe(takeUntil(this.destroy$));
  }

  ngOnDestroy(): void {
    this.destroy$.next();
    this.destroy$.complete();
  }
}

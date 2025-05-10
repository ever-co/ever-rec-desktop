import { CommonModule } from '@angular/common';
import { Component, OnDestroy, OnInit, inject } from '@angular/core';
import { MatCardModule } from '@angular/material/card';
import { MatProgressSpinnerModule } from '@angular/material/progress-spinner';

import { audioActions, selectAudioState } from '@ever-co/audio-data-access';
import {
  ActionButtonComponent,
  ActionButtonGroupComponent,
  ConfirmationDialogService,
  GalleryButtonsActionComponent,
  NoDataComponent,
} from '@ever-co/shared-components';
import {
  HumanizePipe,
  InfiniteScrollDirective,
  LayoutService,
  PopoverDirective,
} from '@ever-co/shared-service';
import {
  IActionButton,
  IAudio,
  IRange,
  ISelected,
  ITimeLog,
  IVideo,
} from '@ever-co/shared-utils';
import { Store } from '@ngrx/store';
import { Observable, Subject, filter, map, take, takeUntil, tap } from 'rxjs';

import { MatButtonModule } from '@angular/material/button';
import { MatCheckboxModule } from '@angular/material/checkbox';
import { MatIconModule } from '@angular/material/icon';
import { Router } from '@angular/router';
import {
  audioPlayerActions,
  selectCurrentAudio,
  selectCurrentTimeFormatted,
  selectDurationFormatted,
  selectIsPlaying,
  selectProgressPercentage,
} from '@ever-co/audio-data-access';
import {
  AudioPlayerMode,
  ContainerComponent,
  MetadataComponent,
} from '@ever-co/audio-ui';
import { selectGenerateVideoState } from '@ever-co/convert-video-data-access';
import { selectScreenshotState } from '@ever-co/screenshot-data-access';
import {
  UploadAudioItem,
  selectUploadInProgress,
  uploadActions,
} from '@ever-co/upload-data-access';
import { selectSettingStorageState } from '@ever-co/web-setting-data-access';
import { PlayerContainerComponent } from '../player-container/player-container.component';
import { selectDateRange } from '@ever-co/date-picker-data-access';

@Component({
  selector: 'lib-audio-gallery',
  imports: [
    CommonModule,
    InfiniteScrollDirective,
    NoDataComponent,
    MatCardModule,
    MatProgressSpinnerModule,
    GalleryButtonsActionComponent,
    ActionButtonGroupComponent,
    PlayerContainerComponent,
    HumanizePipe,
    MetadataComponent,
    PopoverDirective,
    MatIconModule,
    MatCheckboxModule,
    ActionButtonComponent,
    MatButtonModule,
    ContainerComponent,
  ],
  templateUrl: './gallery.component.html',
  styleUrl: './gallery.component.scss',
})
export class GalleryComponent implements OnInit, OnDestroy {
  private destroy$ = new Subject<void>();
  public store = inject(Store);
  private currentPage = 1;
  private hasNext = false;
  private range!: IRange;
  public galleryButtons: IActionButton[] = [];
  public cardButtons: IActionButton[] = [];
  private readonly commonButtons: IActionButton[] = [
    {
      label: 'Upload',
      variant: 'success',
      icon: 'backup',
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
      loading: this.deleting$,
      action: this.deleteAudios.bind(this),
    },
  ];

  public infoButton: IActionButton = {
    icon: 'info',
    label: 'Get Info',
    variant: 'default',
  };

  constructor(
    private readonly confirmationDialogService: ConfirmationDialogService,
    public readonly layoutService: LayoutService,
    private readonly router: Router,
  ) {
    this.galleryButtons = [
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
      ...this.commonButtons,
    ];
    this.cardButtons = [...this.commonButtons];
  }

  ngOnInit(): void {
    this.store
      .select(selectAudioState)
      .pipe(
        tap((state) => {
          this.hasNext = state.hasNext;
        }),
        takeUntil(this.destroy$),
      )
      .subscribe();

    this.store
      .select(selectDateRange)
      .pipe(
        tap((range) => {
          this.range = range;
          this.currentPage = 1;
          this.store.dispatch(audioActions.resetAudios());
          this.loadAudios();
        }),
        takeUntil(this.destroy$),
      )
      .subscribe();

    this.store
      .select(selectAudioState)
      .pipe(
        filter(({ deleting }) => deleting),
        tap(() => this.unselectAll()),
        takeUntil(this.destroy$),
      )
      .subscribe();
  }

  public get isAvailable$() {
    return this.store.select(selectAudioState).pipe(
      map((state) => state.count > 0),
      takeUntil(this.destroy$),
    );
  }

  public get loading$() {
    return this.store.select(selectAudioState).pipe(
      map((state) => state.loading),
      takeUntil(this.destroy$),
    );
  }

  public get audios$() {
    return this.store.select(selectAudioState).pipe(
      map((state) => state.audios),
      takeUntil(this.destroy$),
    );
  }

  public moreAudios(): void {
    if (this.hasNext) {
      this.currentPage++;
      this.loadAudios();
    }
  }

  public loadAudios(): void {
    this.store.dispatch(
      audioActions.loadAudios({
        page: this.currentPage,
        ...this.range,
      }),
    );
  }

  public selectAudio(checked: boolean, data: IAudio): void {
    const audio: ISelected<IAudio> = {
      data,
      selected: checked,
    };
    this.store.dispatch(
      audio.selected
        ? audioActions.selectAudio({ audio })
        : audioActions.unselectAudio({ audio }),
    );
  }

  public get selectedAudios$(): Observable<ISelected<IAudio>[]> {
    return this.store.select(selectAudioState).pipe(
      map((state) => state.selectedAudios),
      takeUntil(this.destroy$),
    );
  }

  public get moreThanOneSelected$(): Observable<boolean> {
    return this.selectedAudios$.pipe(
      map((audios) => audios.length > 1),
      takeUntil(this.destroy$),
    );
  }

  public get lessThanOneSelected$(): Observable<boolean> {
    return this.selectedAudios$.pipe(
      map((audios) => audios.length <= 1),
      takeUntil(this.destroy$),
    );
  }

  public get size$(): Observable<number> {
    return this.selectedAudios$.pipe(
      map((audios) => audios.length),
      takeUntil(this.destroy$),
    );
  }

  private deleteAudios(selectedAudios: ISelected<IAudio>[]): void {
    const audios = selectedAudios.map((audio) => audio.data);
    const s = audios.length > 1 ? 's' : '';
    this.confirmationDialogService
      .open({
        title: `Delete Audio${s}?`,
        message: `Are you sure you want to delete ${audios.length} audio${s}?`,
        variant: 'danger',
      })
      .pipe(
        take(1),
        filter(Boolean),
        tap(() =>
          this.store.dispatch(audioActions.deleteSelectedAudios({ audios })),
        ),
        takeUntil(this.destroy$),
      )
      .subscribe();
  }

  public adapter(audio: IAudio): ISelected<IAudio>[] {
    return [
      {
        data: audio,
        selected: false,
      },
    ];
  }

  public get deleting$(): Observable<boolean> {
    return this.store.select(selectAudioState).pipe(
      map((state) => state.deleting),
      takeUntil(this.destroy$),
    );
  }

  public isChecked(audio: IAudio): Observable<boolean> {
    return this.selectedAudios$.pipe(
      map((selectedAudios) =>
        selectedAudios.some((v) => v.data.id === audio.id),
      ),
      takeUntil(this.destroy$),
    );
  }

  public async viewTimeLog(timeLogId: ITimeLog['id']): Promise<void> {
    await this.router.navigate(['/', 'timesheet'], {
      queryParams: { timeLogId },
    });
  }

  public async viewVideo(videoId: IVideo['id']): Promise<void> {
    await this.router.navigate(['/', 'library', 'videos', videoId]);
  }

  public synchronizePlayPause(audio: IAudio): void {
    this.store.dispatch(
      audioPlayerActions.synchronizeAudio({ audio, kind: 'play' }),
    );
  }

  public synchronizeSeek(ratio: number, audio: IAudio): void {
    this.store.dispatch(
      audioPlayerActions.synchronizeAudio({ audio, ratio, kind: 'seek' }),
    );
  }

  public unselectAll(): void {
    this.store.dispatch(audioActions.unselectAllAudios());
  }

  public get currentAudio$(): Observable<IAudio | null> {
    return this.store.select(selectCurrentAudio);
  }

  public get isPlaying$() {
    return this.store.select(selectIsPlaying);
  }

  public get progressPercentage$() {
    return this.store.select(selectProgressPercentage);
  }

  public get currentTimeFormatted$() {
    return this.store.select(selectCurrentTimeFormatted);
  }

  public get durationFormatted$() {
    return this.store.select(selectDurationFormatted);
  }

  public get mode(): AudioPlayerMode {
    return this.layoutService.isMobileView() ? 'card' : 'player';
  }

  public get generating$(): Observable<boolean> {
    return this.store.select(selectGenerateVideoState).pipe(
      map((state) => state.generating),
      takeUntil(this.destroy$),
    );
  }

  public get capturing$(): Observable<boolean> {
    return this.store.select(selectScreenshotState).pipe(
      map((state) => state.capturing),
      takeUntil(this.destroy$),
    );
  }

  private get uploading$(): Observable<boolean> {
    return this.store
      .select(selectUploadInProgress)
      .pipe(takeUntil(this.destroy$));
  }

  private get isUploadHidden$(): Observable<boolean> {
    return this.store.select(selectSettingStorageState).pipe(
      map(({ uploadConfig }) => !uploadConfig.manualSync),
      takeUntil(this.destroy$),
    );
  }

  private upload(selectedAudios: ISelected<IAudio>[]): void {
    const size = selectedAudios.length;
    const s = size > 1 ? 's' : '';

    this.confirmationDialogService
      .open({
        title: `Upload Audio${s}`,
        message: `Are you sure you want to upload audio${s}?`,
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
        map(() => selectedAudios.map(({ data }) => new UploadAudioItem(data))),
        tap((items) =>
          this.store.dispatch(uploadActions.addItemToQueue({ items })),
        ),
        takeUntil(this.destroy$),
      )
      .subscribe();
  }

  ngOnDestroy(): void {
    this.destroy$.next();
    this.destroy$.complete();
  }
}

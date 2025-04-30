import { CommonModule } from '@angular/common';
import { Component, OnDestroy, OnInit, inject } from '@angular/core';
import { MatCardModule } from '@angular/material/card';
import { MatProgressSpinnerModule } from '@angular/material/progress-spinner';
import { Router } from '@angular/router';

import {
  ConfirmationDialogService,
  GalleryButtonsActionComponent,
  NoDataComponent,
} from '@ever-co/shared-components';
import {
  HumanizePipe,
  InfiniteScrollDirective,
  LayoutService,
  PopoverDirective,
  selectDatePickerState,
} from '@ever-co/shared-service';
import {
  IActionButton,
  IAudio,
  IRange,
  ISelected,
} from '@ever-co/shared-utils';
import { audioActions, selectAudioState } from '@ever-co/webcam-data-access';
import { Store } from '@ngrx/store';
import { Observable, Subject, filter, map, take, takeUntil, tap } from 'rxjs';

import {
  audioPlayerActions,
  selectCurrentAudio,
  selectCurrentTimeFormatted,
  selectDurationFormatted,
  selectIsPlaying,
  selectProgressPercentage,
} from '@ever-co/audio-data-access';
import { AudioPlayerContainerComponent } from '@ever-co/audio-feature';
import {
  AudioPlayerMode,
  InlineComponent,
  MetadataComponent,
} from '@ever-co/audio-ui';
import { MatIconModule } from '@angular/material/icon';
import { MatCheckboxModule } from '@angular/material/checkbox';

@Component({
  selector: 'lib-audio-gallery',
  imports: [
    CommonModule,
    InfiniteScrollDirective,
    NoDataComponent,
    MatCardModule,
    MatProgressSpinnerModule,
    GalleryButtonsActionComponent,
    AudioPlayerContainerComponent,
    InlineComponent,
    HumanizePipe,
    MetadataComponent,
    PopoverDirective,
    MatIconModule,
    MatCheckboxModule,
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
  public actionButtons: IActionButton[] = [
    {
      icon: 'visibility',
      label: 'View',
      variant: 'default',
      hide: this.moreThanOneSelected$,
      action: this.view.bind(this),
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
      action: this.deleteAudios.bind(this),
    },
  ];

  constructor(
    private readonly router: Router,
    private readonly confirmationDialogService: ConfirmationDialogService,
    public readonly layoutService: LayoutService
  ) {}

  ngOnInit(): void {
    this.store
      .select(selectAudioState)
      .pipe(
        tap((state) => {
          this.hasNext = state.hasNext;
        }),
        takeUntil(this.destroy$)
      )
      .subscribe();

    this.store
      .select(selectDatePickerState)
      .pipe(
        tap((state) => {
          this.range = state.selectedRange;
          this.currentPage = 1;
          this.store.dispatch(audioActions.resetAudios());
          this.loadAudios();
        }),
        takeUntil(this.destroy$)
      )
      .subscribe();

    this.store
      .select(selectAudioState)
      .pipe(
        filter(({ deleting }) => deleting),
        tap(() => this.unselectAll()),
        takeUntil(this.destroy$)
      )
      .subscribe();
  }

  public get isAvailable$() {
    return this.store.select(selectAudioState).pipe(
      map((state) => state.count > 0),
      takeUntil(this.destroy$)
    );
  }

  public get capturing$() {
    return this.store.select(selectAudioState).pipe(
      map((state) => state.loading),
      takeUntil(this.destroy$)
    );
  }

  public get audios$() {
    return this.store.select(selectAudioState).pipe(
      map((state) => state.audios),
      takeUntil(this.destroy$)
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
      })
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
        : audioActions.unselectAudio({ audio })
    );
  }

  public get selectedAudios$(): Observable<ISelected<IAudio>[]> {
    return this.store.select(selectAudioState).pipe(
      map((state) => state.selectedAudios),
      takeUntil(this.destroy$)
    );
  }

  public get moreThanOneSelected$(): Observable<boolean> {
    return this.selectedAudios$.pipe(
      map((audios) => audios.length > 1),
      takeUntil(this.destroy$)
    );
  }

  public get lessThanOneSelected$(): Observable<boolean> {
    return this.selectedAudios$.pipe(
      map((audios) => audios.length <= 1),
      takeUntil(this.destroy$)
    );
  }

  public get size$(): Observable<number> {
    return this.selectedAudios$.pipe(
      map((audios) => audios.length),
      takeUntil(this.destroy$)
    );
  }

  private async view(selectedAudios: ISelected<IAudio>[]): Promise<void> {
    const audioId = selectedAudios[0].data.id;
    await this.router.navigate(['/', 'library', 'webcams', 'audios', audioId]);
    this.store.dispatch(
      audioActions.unselectAudio({
        audio: selectedAudios[0],
      })
    );
  }

  private deleteAudios(selectedAudios: ISelected<IAudio>[]): void {
    const audios = selectedAudios.map((audio) => audio.data);
    this.confirmationDialogService
      .open({
        title: 'Delete Audios?',
        message: `Are you sure you want to delete ${audios.length} audios?`,
        variant: 'danger',
      })
      .pipe(
        take(1),
        filter(Boolean),
        tap(() =>
          this.store.dispatch(audioActions.deleteSelectedAudios({ audios }))
        ),
        takeUntil(this.destroy$)
      )
      .subscribe();
  }

  public get deleting$(): Observable<boolean> {
    return this.store.select(selectAudioState).pipe(
      map((state) => state.deleting),
      takeUntil(this.destroy$)
    );
  }

  public isChecked(audio: IAudio): Observable<boolean> {
    return this.selectedAudios$.pipe(
      map((selectedAudios) =>
        selectedAudios.some((v) => v.data.id === audio.id)
      ),
      takeUntil(this.destroy$)
    );
  }

  public synchronize(audio: IAudio): void {
    this.store.dispatch(audioPlayerActions.synchronizeAudio({ audio }));
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

  ngOnDestroy(): void {
    this.destroy$.next();
    this.destroy$.complete();
  }
}

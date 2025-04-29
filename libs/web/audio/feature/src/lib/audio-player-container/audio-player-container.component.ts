import { CommonModule } from '@angular/common';
import {
  ChangeDetectionStrategy,
  Component,
  ElementRef,
  EventEmitter,
  HostBinding,
  Input,
  OnDestroy,
  OnInit,
  Output,
  ViewChild,
} from '@angular/core';
import {
  audioPlayerActions,
  AudioPlayerSyncService,
  selectCurrentAudio,
  selectCurrentTimeFormatted,
  selectDuration,
  selectDurationFormatted,
  selectIsMuted,
  selectIsPlaying,
  selectProgressPercentage,
  selectRemainingTimeFormatted,
  selectVolume,
} from '@ever-co/audio-data-access';
import {
  AudioPlayerMode,
  CardComponent,
  HostComponent,
  InlineComponent,
  PlayerComponent,
} from '@ever-co/audio-ui';
import { IAudio, isDeepEqual, ISelected } from '@ever-co/shared-utils';
import { Store } from '@ngrx/store';
import {
  catchError,
  concatMap,
  defer,
  delay,
  distinctUntilChanged,
  EMPTY,
  filter,
  fromEvent,
  map,
  Observable,
  of,
  Subject,
  switchMap,
  take,
  takeUntil,
  tap,
  withLatestFrom,
} from 'rxjs';

@Component({
  selector: 'lib-audio-player-container',
  imports: [
    CommonModule,
    HostComponent,
    CardComponent,
    PlayerComponent,
    InlineComponent,
  ],
  templateUrl: './audio-player-container.component.html',
  styleUrl: './audio-player-container.component.scss',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class AudioPlayerContainerComponent implements OnInit, OnDestroy {
  private destroy$ = new Subject<void>();

  @ViewChild('player', { static: false })
  playerRef!: ElementRef<HTMLAudioElement>;

  @Input() audio!: IAudio;
  @Input() mode: AudioPlayerMode = 'inline';
  @Input() checked: boolean | null = false;
  @Output() selected = new EventEmitter<ISelected<IAudio>>();

  @HostBinding('class')
  get hostClasses(): string {
    return `audio-player-${this.mode}`;
  }

  constructor(
    private readonly store: Store,
    private readonly synchronizeService: AudioPlayerSyncService
  ) {}

  ngOnInit(): void {
    if (this.audio) {
      this.store.dispatch(
        audioPlayerActions.selectAudio({ audio: this.audio })
      );
    }
  }

  ngAfterViewInit(): void {
    if (!this.playerRef) return;

    const player = this.playerRef.nativeElement;

    // Set up event listeners
    fromEvent(player, 'loadedmetadata')
      .pipe(
        withLatestFrom(this.currentAudio$),
        map(([_, audio]) => audio),
        filter(Boolean),
        takeUntil(this.destroy$)
      )
      .subscribe((audio) => {
        this.store.dispatch(
          audioPlayerActions.updateAudioState({
            currentTime: player.currentTime,
            duration: audio.metadata?.duration || player.duration || 0,
            isPlaying: !player.paused,
            volume: player.volume,
            isMuted: player.muted,
          })
        );
      });

    fromEvent(player, 'timeupdate')
      .pipe(takeUntil(this.destroy$))
      .subscribe(() => {
        this.store.dispatch(
          audioPlayerActions.seekAudio({ time: player.currentTime })
        );
      });

    fromEvent(player, 'play')
      .pipe(
        withLatestFrom(this.currentAudio$),
        map(([_, audio]) => audio),
        filter(Boolean),
        takeUntil(this.destroy$)
      )
      .subscribe((audio) => {
        this.store.dispatch(audioPlayerActions.playAudio({ audio }));
      });

    fromEvent(player, 'pause')
      .pipe(takeUntil(this.destroy$))
      .subscribe(() => {
        this.store.dispatch(audioPlayerActions.pauseAudio());
      });

    fromEvent(player, 'ended')
      .pipe(takeUntil(this.destroy$))
      .subscribe(() => {
        this.store.dispatch(audioPlayerActions.pauseAudio());
      });

    fromEvent(player, 'volumechange')
      .pipe(takeUntil(this.destroy$))
      .subscribe(() => {
        this.store.dispatch(
          audioPlayerActions.updateVolume({ volume: player.volume })
        );

        this.store.dispatch(
          audioPlayerActions.toggleMute({ isMuted: player.muted })
        );
      });

    this.synchronizeService.onSynchronize
      .pipe(
        withLatestFrom(this.currentAudio$, this.isPlaying$),
        distinctUntilChanged(isDeepEqual.bind(this)),
        concatMap(([audio, current]) => {
          if (!current) {
            return EMPTY;
          }

          const isSame = audio.id === current.id;

          if (!isSame && audio && this.player) {
            this.pauseIfPlaying();
            this.store.dispatch(audioPlayerActions.selectAudio({ audio }));
            this.player.currentTime = 0;
            this.player.src = audio.pathname;
            this.player.load();
          }

          return of(true).pipe(
            delay(150),
            switchMap(() =>
              this.togglePlayPause$.pipe(
                tap(() =>
                  this.store.dispatch(
                    audioPlayerActions.synchronizeAudioSuccess()
                  )
                ),
                catchError((error) => {
                  this.store.dispatch(
                    audioPlayerActions.synchronizeAudioFailure({ error })
                  );
                  return EMPTY;
                })
              )
            )
          );
        }),
        takeUntil(this.destroy$)
      )
      .subscribe();
  }

  public get currentAudio$(): Observable<IAudio | null> {
    return this.store.select(selectCurrentAudio);
  }

  public get player(): HTMLAudioElement | undefined {
    return this.playerRef?.nativeElement;
  }

  // Selectors
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

  public get remainingTimeFormatted$() {
    return this.store.select(selectRemainingTimeFormatted);
  }

  public get volume$() {
    return this.store.select(selectVolume);
  }

  public get isMuted$() {
    return this.store.select(selectIsMuted);
  }

  public get togglePlayPause$(): Observable<void> {
    return defer(async () => {
      if (!this.player) return;

      if (this.player.paused) {
        await this.player.play();
      } else {
        this.player.pause();
      }
    });
  }

  public togglePlayPause(): void {
    this.togglePlayPause$.pipe(take(1)).subscribe();
  }

  public toggleMute(): void {
    if (!this.player) return;
    this.player.muted = !this.player.muted;
    this.store.dispatch(
      audioPlayerActions.toggleMute({ isMuted: this.player.muted })
    );
  }

  public setVolume(value: number): void {
    if (!this.player) return;
    const volume = Math.max(0, Math.min(1, value));
    this.player.volume = volume;
    this.player.muted = volume === 0;
  }

  public skipBack(): void {
    if (!this.player) return;
    const time = Math.max(0, this.player.currentTime - 10);
    this.player.currentTime = time;
  }

  public skipForward(): void {
    if (!this.player) return;
    const time = Math.min(this.player.duration, this.player.currentTime + 10);
    this.player.currentTime = time;
  }

  public handleSeek(ratio: number): void {
    this.store
      .select(selectDuration)
      .pipe(
        take(1),
        tap((duration) => {
          if (!this.player) return;
          const time = duration * ratio;
          this.player.currentTime = time;
        })
      )
      .subscribe();
  }

  private pauseIfPlaying(): void {
    if (this.player && !this.player.paused) {
      this.player.pause();
      this.store.dispatch(
        audioPlayerActions.updateAudioState({
          currentTime: 0,
          duration: 0,
          isPlaying: false,
          volume: this.player.volume,
          isMuted: this.player.muted,
        })
      );
    }
  }

  public ngOnDestroy(): void {
    this.destroy$.next();
    this.destroy$.complete();
    this.pauseIfPlaying();
  }
}

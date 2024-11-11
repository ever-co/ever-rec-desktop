import { CommonModule } from '@angular/common';
import {
  AfterViewInit,
  Component,
  ElementRef,
  HostListener,
  OnDestroy,
  OnInit,
  ViewChild,
} from '@angular/core';
import { MatIconModule } from '@angular/material/icon';
import { MatTooltipModule } from '@angular/material/tooltip';
import { selectGenerateVideoState } from '@ever-co/convert-video-data-access';
import { ITimelinePlayer, moment } from '@ever-co/shared-utils';
import {
  selectTimelineState,
  timelineActions,
} from '@ever-co/timeline-data-access';
import { Store } from '@ngrx/store';
import {
  BehaviorSubject,
  catchError,
  distinctUntilChanged,
  filter,
  fromEvent,
  map,
  Observable,
  of,
  Subject,
  takeUntil,
  tap,
} from 'rxjs';

@Component({
  selector: 'lib-timeline-video',
  standalone: true,
  imports: [CommonModule, MatTooltipModule, MatIconModule],
  templateUrl: './timeline-video.component.html',
  styleUrl: './timeline-video.component.scss',
})
export class TimelineVideoComponent
  implements OnInit, OnDestroy, AfterViewInit
{
  private destroy$ = new Subject<void>();

  @ViewChild('videoPlayer', { static: false })
  private videoPlayer!: ElementRef<HTMLVideoElement>;

  public source$!: Observable<string>;
  public generating$!: Observable<boolean>;
  public isFullscreen$ = new BehaviorSubject<boolean>(false);
  public currentTime$ = new BehaviorSubject<string>('00:00:00');
  public duration$ = new BehaviorSubject<string>('00:00');

  constructor(private readonly store: Store) {}

  ngOnInit(): void {
    this.setupSourceObservable();
    this.setupGeneratingObservable();
  }

  ngAfterViewInit(): void {
    this.source$
      .pipe(
        filter(() => !!this.videoPlayer),
        tap(() => this.reload()),
        takeUntil(this.destroy$)
      )
      .subscribe();

    this.player$
      .pipe(
        filter(({ isPlaying }) => !isPlaying),
        map((state) => state.currentTime),
        distinctUntilChanged(),
        map((currentTime) => (this.player.currentTime = currentTime)),
        takeUntil(this.destroy$)
      )
      .subscribe();

    fromEvent(this.player, 'play')
      .pipe(
        tap(() =>
          this.store.dispatch(
            timelineActions.togglePlayback({ isPlaying: true })
          )
        ),
        takeUntil(this.destroy$)
      )
      .subscribe();

    fromEvent(this.player, 'timeupdate')
      .pipe(
        map((event) => event.target as HTMLVideoElement),
        filter(Boolean),
        tap(({ currentTime }) =>
          this.store.dispatch(timelineActions.seekTo({ currentTime }))
        ),
        takeUntil(this.destroy$)
      )
      .subscribe();

    fromEvent(this.player, 'timeupdate')
      .pipe(
        map((event) => event.target as HTMLVideoElement),
        filter(Boolean),
        tap(({ currentTime }) =>
          this.currentTime$.next(
            moment
              .duration(currentTime, 'seconds')
              .format('hh:mm:ss.SS', { trim: false })
          )
        ),
        takeUntil(this.destroy$)
      )
      .subscribe();

    fromEvent(this.player, 'pause')
      .pipe(
        tap(() =>
          this.store.dispatch(
            timelineActions.togglePlayback({ isPlaying: false })
          )
        ),
        takeUntil(this.destroy$)
      )
      .subscribe();
  }

  @HostListener('document:keydown', ['$event'])
  private handleKeydown(event: KeyboardEvent): void {
    if (event.target instanceof HTMLInputElement) return;

    switch (event.code) {
      case 'Space':
        event.preventDefault();
        this.togglePlayPause();
        break;
      case 'KeyF':
        event.preventDefault();
        this.fullscreen();
        break;
    }
  }

  public async togglePlayPause(): Promise<void> {
    if (!this.player) {
      console.error('Video player is not available');
      return;
    }

    if (this.isPaused) {
      await this.player.play();
    } else {
      this.player.pause();
    }
  }

  public async fullscreen(): Promise<void> {
    if (!this.player) {
      console.error('Video player is not available');
      return;
    }

    await this.player.requestFullscreen();
  }

  public get isPaused(): boolean {
    return this.player?.paused;
  }

  private setupSourceObservable(): void {
    this.source$ = this.player$.pipe(
      map((state) => state.video),
      distinctUntilChanged(),
      map((video) => video.pathname),
      catchError((err) => {
        console.error('Error in source observable', err);
        return '';
      }),
      takeUntil(this.destroy$)
    );
  }

  private get player$(): Observable<ITimelinePlayer> {
    return this.store.select(selectTimelineState).pipe(
      map(({ player }) => player),
      distinctUntilChanged(),
      takeUntil(this.destroy$)
    );
  }

  private setupGeneratingObservable(): void {
    this.generating$ = this.store.select(selectGenerateVideoState).pipe(
      map(({ generating }) => generating),
      catchError((err) => {
        console.error('Error in generating observable', err);
        return of(false);
      }),
      takeUntil(this.destroy$)
    );
  }

  private reload(): void {
    if (this.player) {
      this.player.load();
    } else {
      console.warn('videoPlayer is not ready yet...');
    }
  }

  public get player(): HTMLVideoElement {
    return this.videoPlayer?.nativeElement;
  }

  public get isPlaying$(): Observable<boolean> {
    return this.player$.pipe(
      map(({ isPlaying }) => {
        return isPlaying;
      }),
      takeUntil(this.destroy$)
    );
  }

  ngOnDestroy(): void {
    this.destroy$.next();
    this.destroy$.complete();
  }
}

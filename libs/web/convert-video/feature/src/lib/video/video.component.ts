/* eslint-disable @angular-eslint/no-input-rename */
import { CommonModule } from '@angular/common';
import {
  AfterViewInit,
  Component,
  ElementRef,
  Input,
  OnDestroy,
  OnInit,
  ViewChild,
  inject,
} from '@angular/core';
import { MatIconModule } from '@angular/material/icon';
import { MatTooltipModule } from '@angular/material/tooltip';
import {
  generateVideoActions,
  selectGenerateVideoState,
  selectVideoRemoteControlState,
} from '@ever-co/convert-video-data-access';
import { IVideo } from '@ever-co/shared-utils';
import { Store } from '@ngrx/store';
import {
  BehaviorSubject,
  Observable,
  Subject,
  catchError,
  filter,
  fromEvent,
  map,
  of,
  takeUntil,
  tap,
} from 'rxjs';

@Component({
  selector: 'lib-video',
  standalone: true,
  imports: [CommonModule, MatTooltipModule, MatIconModule],
  templateUrl: './video.component.html',
  styleUrls: ['./video.component.scss'], // Fixed typo
})
export class VideoComponent implements OnInit, AfterViewInit, OnDestroy {
  private store = inject(Store);
  private destroy$ = new Subject<void>();

  @ViewChild('videoPlayer', { static: false })
  private videoPlayer!: ElementRef<HTMLVideoElement>;

  @Input({
    alias: 'remote',
    transform: (value: string) => value === 'true',
  })
  public isControlledRemotely = false;

  public source$!: Observable<string>;
  public generating$!: Observable<boolean>;
  private video!: IVideo;
  public played$ = new BehaviorSubject<boolean>(false);

  ngOnInit(): void {
    this.setupSourceObservable();
    this.setupGeneratingObservable();
    this.setupRemoteControlObservable();
    this.store.dispatch(generateVideoActions.loadLastVideo());
  }

  ngAfterViewInit(): void {
    this.store
      .select(selectGenerateVideoState)
      .pipe(
        filter(() => !!this.videoPlayer),
        tap(() => this.reload()),
        takeUntil(this.destroy$)
      )
      .subscribe();
    fromEvent(this.player, 'play')
      .pipe(
        tap(() => this.played$.next(true)),
        takeUntil(this.destroy$)
      )
      .subscribe();

    fromEvent(this.player, 'pause')
      .pipe(
        tap(() => this.played$.next(false)),
        takeUntil(this.destroy$)
      )
      .subscribe();
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
    this.source$ = this.store.select(selectGenerateVideoState).pipe(
      map((state) => {
        this.video = state.video;
        return state.video.pathname;
      }),
      catchError((err) => {
        console.error('Error in source observable', err);
        return '';
      }),
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

  private setupRemoteControlObservable(): void {
    this.store
      .select(selectVideoRemoteControlState)
      .pipe(
        filter(() => this.isControlledRemotely && !!this.player),
        tap((remoteState) => {
          const videoDuration = this.video.metadata?.duration || 0;
          const scrollDuration =
            (videoDuration * remoteState.scrollPercentage) / 100;
          this.player.currentTime = scrollDuration;
        }),
        catchError((err) => {
          console.error('Error in remote control observable', err);
          return [];
        }),
        takeUntil(this.destroy$)
      )
      .subscribe();
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

  ngOnDestroy(): void {
    this.destroy$.next();
    this.destroy$.complete();
  }
}

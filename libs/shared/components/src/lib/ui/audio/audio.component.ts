// audio.component.ts
import {
  AfterViewInit,
  ChangeDetectionStrategy,
  Component,
  ElementRef,
  HostBinding,
  Input,
  OnDestroy,
  ViewChild,
} from '@angular/core';
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';
import { UtcToLocalTimePipe } from '@ever-co/shared-service';
import { IAudio } from '@ever-co/shared-utils';
import { CommonModule } from '@angular/common';
import { BehaviorSubject, fromEvent, merge, Observable, Subject } from 'rxjs';
import { map, takeUntil } from 'rxjs/operators';

export type AudioPlayerMode = 'host' | 'inline' | 'card' | 'player';

@Component({
  selector: 'lib-audio',
  standalone: true,
  imports: [CommonModule, MatIconModule, MatButtonModule, UtcToLocalTimePipe],
  templateUrl: './audio.component.html',
  styleUrls: ['./audio.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class AudioComponent implements AfterViewInit, OnDestroy {
  @ViewChild('player', { static: false })
  public playerRef!: ElementRef<HTMLAudioElement>;

  @Input({ required: true })
  public audio!: IAudio;

  @Input()
  public mode: AudioPlayerMode = 'inline';

  @HostBinding('class')
  get hostClasses(): string {
    return `audio-player-${this.mode}`;
  }

  // State observables
  public currentTime$ = new BehaviorSubject<number>(0);
  public duration$ = new BehaviorSubject<number>(0);
  public isPlaying$ = new BehaviorSubject<boolean>(false);
  public volume$ = new BehaviorSubject<number>(1);
  public isMuted$ = new BehaviorSubject<boolean>(false);

  // Derived observables
  public progressPercentage$: Observable<number>;
  public currentTimeFormatted$: Observable<string>;
  public durationFormatted$: Observable<string>;
  public remainingTimeFormatted$: Observable<string>;

  // Cleanup subject
  private destroy$ = new Subject<void>();

  constructor() {
    // Create derived observables
    this.progressPercentage$ = this.createProgressPercentageObservable();
    this.currentTimeFormatted$ = this.currentTime$.pipe(
      map((time) => this.formatTime(time))
    );
    this.durationFormatted$ = this.duration$.pipe(
      map((duration) => this.formatTime(duration))
    );
    this.remainingTimeFormatted$ = this.createRemainingTimeObservable();
  }

  ngAfterViewInit(): void {
    if (!this.playerRef) return;

    const player = this.playerRef.nativeElement;

    // Set up event listeners using observables
    fromEvent(player, 'loadedmetadata')
      .pipe(takeUntil(this.destroy$))
      .subscribe(() => {
        this.duration$.next(
          this.audio.metadata?.duration || player.duration || 0
        );
        // Apply volume settings
        player.volume = this.volume$.getValue();
        player.muted = this.isMuted$.getValue();
      });

    merge(fromEvent(player, 'timeupdate'), fromEvent(player, 'seeking'))
      .pipe(takeUntil(this.destroy$))
      .subscribe(() => {
        this.currentTime$.next(player.currentTime);
      });

    fromEvent(player, 'play')
      .pipe(takeUntil(this.destroy$))
      .subscribe(() => {
        this.isPlaying$.next(true);
      });

    fromEvent(player, 'pause')
      .pipe(takeUntil(this.destroy$))
      .subscribe(() => {
        this.isPlaying$.next(false);
      });

    fromEvent(player, 'ended')
      .pipe(takeUntil(this.destroy$))
      .subscribe(() => {
        this.isPlaying$.next(false);
      });

    // Volume change events
    fromEvent(player, 'volumechange')
      .pipe(takeUntil(this.destroy$))
      .subscribe(() => {
        this.volume$.next(player.volume);
        this.isMuted$.next(player.muted);
      });

    // Initialize if metadata is already available
    if (this.audio.metadata?.duration) {
      this.duration$.next(this.audio.metadata.duration);
    }
  }

  ngOnDestroy(): void {
    // Clean up all subscriptions
    this.destroy$.next();
    this.destroy$.complete();

    // Ensure playback is stopped when component is destroyed
    if (this.player && !this.player.paused) {
      this.player.pause();
    }
  }

  public get player(): HTMLAudioElement | undefined {
    return this.playerRef?.nativeElement;
  }

  public async togglePlayPause(): Promise<void> {
    if (!this.player) return;

    try {
      if (this.player.paused) {
        await this.player.play();
      } else {
        this.player.pause();
      }
    } catch (error) {
      console.error('Playback error:', error);
    }
  }

  public toggleMute(): void {
    if (!this.player) return;
    this.player.muted = !this.player.muted;
  }

  public setVolume(value: number): void {
    if (!this.player) return;
    this.player.volume = Math.max(0, Math.min(1, value));
  }

  public skipBack(): void {
    if (!this.player) return;
    // Skip back 10 seconds or to the beginning
    this.player.currentTime = Math.max(0, this.player.currentTime - 10);
  }

  public skipForward(): void {
    if (!this.player) return;
    // Skip forward 10 seconds
    const duration = this.duration$.getValue();
    this.player.currentTime = Math.min(duration, this.player.currentTime + 10);
  }

  public seekAudio(event: MouseEvent): void {
    if (!this.player) return;

    const progressBar = event.currentTarget as HTMLElement;
    const rect = progressBar.getBoundingClientRect();
    const clickPositionRatio = (event.clientX - rect.left) / rect.width;

    // Set the current time based on click position
    const duration = this.duration$.getValue();
    this.player.currentTime = duration * clickPositionRatio;
  }

  public formatTime(seconds: number): string {
    if (isNaN(seconds) || !isFinite(seconds)) return '0:00';

    const minutes = Math.floor(seconds / 60);
    const remainingSeconds = Math.floor(seconds % 60);
    return `${minutes}:${remainingSeconds.toString().padStart(2, '0')}`;
  }

  private createProgressPercentageObservable(): Observable<number> {
    return new Observable<number>((observer) => {
      const subscription = this.currentTime$
        .pipe(takeUntil(this.destroy$))
        .subscribe((currentTime) => {
          const duration = this.duration$.getValue();
          const percentage = duration > 0 ? (currentTime / duration) * 100 : 0;
          observer.next(percentage);
        });

      return () => subscription.unsubscribe();
    });
  }

  private createRemainingTimeObservable(): Observable<string> {
    return new Observable<string>((observer) => {
      const subscription = this.currentTime$
        .pipe(takeUntil(this.destroy$))
        .subscribe((currentTime) => {
          const duration = this.duration$.getValue();
          const remainingTime = Math.max(0, duration - currentTime);
          observer.next(this.formatTime(remainingTime));
        });

      return () => subscription.unsubscribe();
    });
  }
}

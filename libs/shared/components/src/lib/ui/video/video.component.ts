import { CommonModule } from '@angular/common';
import {
  AfterViewInit,
  Component,
  ElementRef,
  EventEmitter,
  Input,
  OnDestroy,
  Output,
  ViewChild,
} from '@angular/core';
import { MatButtonModule } from '@angular/material/button';
import { MatCardModule } from '@angular/material/card';
import { MatIconModule } from '@angular/material/icon';
import { MatMenuModule } from '@angular/material/menu';
import { UtcToLocalTimePipe } from '@ever-co/shared-service';
import { IVideo } from '@ever-co/shared-utils';
import { BehaviorSubject, fromEvent, Subject, takeUntil, tap } from 'rxjs';

@Component({
  selector: 'lib-video',
  standalone: true,
  imports: [
    CommonModule,
    MatCardModule,
    MatButtonModule,
    MatIconModule,
    UtcToLocalTimePipe,
    MatMenuModule
  ],
  templateUrl: './video.component.html',
  styleUrl: './video.component.scss',
})
export class VideoComponent implements AfterViewInit, OnDestroy {
  @ViewChild('videoPlayer', { static: false })
  public videoPlayer!: ElementRef<HTMLVideoElement>;

  @Input()
  public controls = false;

  @Input()
  public video!: IVideo;

  public played$ = new BehaviorSubject<boolean>(false);

  private destroy$ = new Subject<void>();

  @Output() view = new EventEmitter<void>();
  @Output() delete = new EventEmitter<void>();

  ngAfterViewInit(): void {
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

  public get player(): HTMLVideoElement {
    return this.videoPlayer?.nativeElement;
  }

  public get isPaused(): boolean {
    return this.player?.paused;
  }

  public viewVideo() {
     this.view.emit();
  }

  public deleteVideo() {
    this.delete.emit();
  }

  ngOnDestroy(): void {
    this.destroy$.next();
    this.destroy$.complete();
  }
}

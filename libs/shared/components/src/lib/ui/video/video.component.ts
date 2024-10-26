import { CommonModule } from '@angular/common';
import {
  AfterViewInit,
  Component,
  ElementRef,
  Input,
  OnDestroy,
  ViewChild,
} from '@angular/core';
import { MatButtonModule } from '@angular/material/button';
import { MatCardModule } from '@angular/material/card';
import { MatIconModule } from '@angular/material/icon';
import { Router } from '@angular/router';
import { videoActions } from '@ever-co/convert-video-data-access';
import { PopoverDirective, UtcToLocalTimePipe } from '@ever-co/shared-service';
import { IActionButton, IVideo } from '@ever-co/shared-utils';
import { Store } from '@ngrx/store';
import { BehaviorSubject, fromEvent, Subject, takeUntil, tap } from 'rxjs';
import { ActionButtonGroupComponent } from '../action-button-group/group/action-button-group.component';

@Component({
  selector: 'lib-video',
  standalone: true,
  imports: [
    CommonModule,
    MatCardModule,
    MatButtonModule,
    MatIconModule,
    UtcToLocalTimePipe,
    PopoverDirective,
    ActionButtonGroupComponent
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

  public actionButtons: IActionButton[] = [
    {
      icon: 'visibility',
      label: 'View',
      variant: 'default',
      action: this.view.bind(this),
    },
    {
      icon: 'delete',
      label: 'Delete',
      variant: 'danger',
      action: this.delete.bind(this),
    },
  ];

  constructor(private readonly router: Router, private readonly store: Store) {}

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

  public async view(video: IVideo): Promise<void> {
    await this.router.navigate(['/', 'library', 'videos', video.id]);
  }

  public async delete(video: IVideo): Promise<void> {
    this.store.dispatch(videoActions.deleteVideo(video));
  }

  ngOnDestroy(): void {
    this.destroy$.next();
    this.destroy$.complete();
  }
}

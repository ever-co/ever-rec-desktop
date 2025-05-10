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
import { MatCheckboxModule } from '@angular/material/checkbox';
import { MatRippleModule } from '@angular/material/core';
import { MatIconModule } from '@angular/material/icon';
import { MatTooltipModule } from '@angular/material/tooltip';
import { ActionButtonGroupComponent } from '@ever-co/shared-components';
import {
  HumanizePipe,
  PopoverDirective,
  ResolutionPipe,
  UtcToLocalTimePipe,
} from '@ever-co/shared-service';
import { IActionButton, ISelected, IVideo } from '@ever-co/shared-utils';
import { BehaviorSubject, fromEvent, Subject, takeUntil, tap } from 'rxjs';

@Component({
  selector: 'lib-video',
  imports: [
    CommonModule,
    MatCardModule,
    MatButtonModule,
    MatIconModule,
    UtcToLocalTimePipe,
    PopoverDirective,
    ActionButtonGroupComponent,
    MatRippleModule,
    MatTooltipModule,
    MatCheckboxModule,
    ResolutionPipe,
    HumanizePipe,
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

  @Input()
  public checked: boolean | null = false;

  @Input()
  public actionButtons: IActionButton[] = [];

  @Output()
  public selected = new EventEmitter<ISelected<IVideo>>();

  public played$ = new BehaviorSubject<boolean>(false);

  private destroy$ = new Subject<void>();

  ngAfterViewInit(): void {
    fromEvent(this.player, 'play')
      .pipe(
        tap(() => this.played$.next(true)),
        takeUntil(this.destroy$),
      )
      .subscribe();

    fromEvent(this.player, 'pause')
      .pipe(
        tap(() => this.played$.next(false)),
        takeUntil(this.destroy$),
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

  public onSelected(checked: boolean): void {
    this.checked = checked;
    this.selected.emit({
      data: this.video,
      selected: checked,
    });
  }

  public adapter(data: IVideo): ISelected<IVideo>[] {
    return [
      {
        data,
        selected: this.checked || false,
      },
    ];
  }

  ngOnDestroy(): void {
    this.destroy$.next();
    this.destroy$.complete();
  }
}

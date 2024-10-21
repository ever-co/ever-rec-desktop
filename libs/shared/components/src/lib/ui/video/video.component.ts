import { CommonModule } from '@angular/common';
import { Component, ElementRef, Input, ViewChild } from '@angular/core';
import { MatButtonModule } from '@angular/material/button';
import { MatCardModule } from '@angular/material/card';
import { MatIconModule } from '@angular/material/icon';
import { UtcToLocalTimePipe } from '@ever-co/shared-service';
import { IVideo } from '@ever-co/shared-utils';

@Component({
  selector: 'lib-video',
  standalone: true,
  imports: [
    CommonModule,
    MatCardModule,
    MatButtonModule,
    MatIconModule,
    UtcToLocalTimePipe,
  ],
  templateUrl: './video.component.html',
  styleUrl: './video.component.scss',
})
export class VideoComponent {
  @ViewChild('videoPlayer', { static: false })
  public videoPlayer!: ElementRef<HTMLVideoElement>;

  @Input()
  public controls = false;

  @Input()
  public video!: IVideo;

  public isPlayed = false;
  public async togglePlayPause(): Promise<void>{
    const player = this.videoPlayer?.nativeElement;

    if (!player) {
      console.error('Video player is not available');
      return;
    }

    if (this.isPlayed) {
      player.pause();
    } else {
       await player.play();
    }

    this.isPlayed = !this.isPlayed;
  }
}

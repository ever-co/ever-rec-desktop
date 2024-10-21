import { CommonModule } from '@angular/common';
import { Component, Input } from '@angular/core';
import { MatCardModule } from '@angular/material/card';
import { MatIconModule } from '@angular/material/icon';
import { UtcToLocalTimePipe } from '@ever-co/shared-service';
import { IVideo } from '@ever-co/shared-utils';

@Component({
  selector: 'lib-video',
  standalone: true,
  imports: [CommonModule, MatCardModule, MatIconModule, UtcToLocalTimePipe],
  templateUrl: './video.component.html',
  styleUrl: './video.component.scss',
})
export class VideoComponent {
  @Input()
  public video!: IVideo
}

import { ChangeDetectionStrategy, Component } from '@angular/core';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'lib-timeline-track',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './timeline-track.component.html',
  styleUrl: './timeline-track.component.scss',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class TimelineTrackComponent {}

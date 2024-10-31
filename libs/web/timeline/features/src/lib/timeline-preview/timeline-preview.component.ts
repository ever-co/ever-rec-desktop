import { ChangeDetectionStrategy, Component } from '@angular/core';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'lib-timeline-preview',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './timeline-preview.component.html',
  styleUrl: './timeline-preview.component.scss',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class TimelinePreviewComponent {}

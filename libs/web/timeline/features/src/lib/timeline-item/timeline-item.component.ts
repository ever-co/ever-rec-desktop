import { ChangeDetectionStrategy, Component } from '@angular/core';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'lib-timeline-item',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './timeline-item.component.html',
  styleUrl: './timeline-item.component.scss',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class TimelineItemComponent {}

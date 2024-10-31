import { ChangeDetectionStrategy, Component } from '@angular/core';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'lib-timeline-container',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './timeline-container.component.html',
  styleUrl: './timeline-container.component.scss',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class TimelineContainerComponent {}

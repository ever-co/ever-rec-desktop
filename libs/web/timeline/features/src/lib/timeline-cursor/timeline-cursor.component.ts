import { ChangeDetectionStrategy, Component } from '@angular/core';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'lib-timeline-cursor',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './timeline-cursor.component.html',
  styleUrl: './timeline-cursor.component.scss',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class TimelineCursorComponent {}

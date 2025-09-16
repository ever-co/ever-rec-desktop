import { ChangeDetectionStrategy, Component, Input } from '@angular/core';


@Component({
  selector: 'lib-time-display',
  imports: [],
  templateUrl: './time-display.component.html',
  styleUrl: './time-display.component.scss',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class TimeDisplayComponent {
  @Input() currentTime: string | null = '0:00';
  @Input() duration: string | null = '0:00';
  @Input() showDuration = true;
}

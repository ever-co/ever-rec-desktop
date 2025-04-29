import { ChangeDetectionStrategy, Component, Input } from '@angular/core';

@Component({
  selector: 'lib-track',
  imports: [],
  templateUrl: './track.component.html',
  styleUrl: './track.component.scss',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class TrackComponent {
  @Input() name = '';
  @Input() author = '';
}

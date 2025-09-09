import {
  ChangeDetectionStrategy,
  Component,
  Input,
  Output,
  EventEmitter,
} from '@angular/core';

import { MatIconModule } from '@angular/material/icon';
import { MatButtonModule } from '@angular/material/button';

@Component({
  selector: 'lib-player-control',
  imports: [MatIconModule, MatButtonModule],
  templateUrl: './control.component.html',
  styleUrl: './control.component.scss',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class ControlComponent {
  @Input() isPlaying = false;
  @Output() playPause = new EventEmitter<void>();
  @Output() skipForward = new EventEmitter<void>();
  @Output() skipBack = new EventEmitter<void>();
}

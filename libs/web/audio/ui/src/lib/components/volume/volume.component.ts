import {
  ChangeDetectionStrategy,
  Component,
  Input,
  Output,
  EventEmitter,
} from '@angular/core';
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';

@Component({
  selector: 'lib-volume-control',
  imports: [MatIconModule, MatButtonModule],
  templateUrl: './volume.component.html',
  styleUrl: './volume.component.scss',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class VolumeComponent {
  @Input() volume = 1;
  @Input() isMuted = false;
  @Output() volumeChange = new EventEmitter<number>();
  @Output() muteToggle = new EventEmitter<void>();
}

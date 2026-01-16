
import { ChangeDetectionStrategy, Component, Input } from '@angular/core';
import {
  AudioPlayerMode,
  BasePlayerComponent,
} from '../modes/base/base-player.component';
import { CardComponent } from '../modes/card/card.component';
import { HostComponent } from '../modes/host/host.component';
import { InlineComponent } from '../modes/inline/inline.component';
import { PlayerComponent } from '../modes/player/player.component';

@Component({
  selector: 'lib-player-container',
  imports: [
    PlayerComponent,
    InlineComponent,
    CardComponent,
    HostComponent
],
  templateUrl: './container.component.html',
  styleUrl: './container.component.scss',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class ContainerComponent extends BasePlayerComponent {
  @Input() mode: AudioPlayerMode = 'inline';
}

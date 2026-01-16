import { ChangeDetectionStrategy, Component } from '@angular/core';
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';

import { BasePlayerComponent } from '../base/base-player.component';
import { ProgressComponent } from '../../components/progress/progress.component';
import { TrackComponent } from '../../components/track/track.component';
import { TimeDisplayComponent } from '../../components/time-display/time-display.component';
import { ControlComponent } from '../../components/control/control.component';
import { VolumeComponent } from '../../components/volume/volume.component';

@Component({
  selector: 'lib-audio-player',
  imports: [
    MatIconModule,
    MatButtonModule,
    ProgressComponent,
    TrackComponent,
    TimeDisplayComponent,
    ControlComponent,
    VolumeComponent
],
  templateUrl: './player.component.html',
  styleUrl: './player.component.scss',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class PlayerComponent extends BasePlayerComponent {}

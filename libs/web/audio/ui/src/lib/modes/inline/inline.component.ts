import { ChangeDetectionStrategy, Component } from '@angular/core';
import { BasePlayerComponent } from '../base/base-player.component';
import { ProgressComponent } from '../../components/progress/progress.component';
import { TrackComponent } from '../../components/track/track.component';
import { TimeDisplayComponent } from '../../components/time-display/time-display.component';
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';


@Component({
  selector: 'lib-audio-inline',
  imports: [
    MatIconModule,
    MatButtonModule,
    ProgressComponent,
    TrackComponent,
    TimeDisplayComponent
],
  templateUrl: './inline.component.html',
  styleUrl: './inline.component.scss',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class InlineComponent extends BasePlayerComponent {}

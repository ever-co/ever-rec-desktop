import { ChangeDetectionStrategy, Component } from '@angular/core';
import { BasePlayerComponent } from '../base/base-player.component';
import { ProgressComponent } from '../../components/progress/progress.component';
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';
import { TrackComponent } from '../../components/track/track.component';
import { CommonModule } from '@angular/common';
import { TimeDisplayComponent } from '../../components/time-display/time-display.component';
import { ControlComponent } from '../../components/control/control.component';

@Component({
  selector: 'lib-audio-card',
  imports: [
    CommonModule,
    MatIconModule,
    MatButtonModule,
    ProgressComponent,
    TrackComponent,
    TimeDisplayComponent,
    ControlComponent,
  ],
  templateUrl: './card.component.html',
  styleUrl: './card.component.scss',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class CardComponent extends BasePlayerComponent {}

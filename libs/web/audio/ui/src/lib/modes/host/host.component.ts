import { ChangeDetectionStrategy, Component } from '@angular/core';
import { BasePlayerComponent } from '../base/base-player.component';
import { CommonModule } from '@angular/common';
import { MatIconModule } from '@angular/material/icon';
import { MatButtonModule } from '@angular/material/button';
import { ProgressComponent } from '../../components/progress/progress.component';
import { TimeDisplayComponent } from '../../components/time-display/time-display.component';

@Component({
  selector: 'lib-audio-host',
  imports: [
    CommonModule,
    MatIconModule,
    MatButtonModule,
    ProgressComponent,
    TimeDisplayComponent,
  ],
  templateUrl: './host.component.html',
  styleUrl: './host.component.scss',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class HostComponent extends BasePlayerComponent {}

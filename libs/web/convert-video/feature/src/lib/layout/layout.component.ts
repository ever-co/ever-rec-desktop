import { CommonModule } from '@angular/common';
import { Component } from '@angular/core';
import { ErrorComponent } from '../error/error.component';
import { SettingComponent } from '../setting/setting.component';
import { StatisticComponent } from '../statistics/statistic.component';
import { VideoComponent } from '../video/video.component';

@Component({
  selector: 'lib-layout',
  standalone: true,
  imports: [
    CommonModule,
    SettingComponent,
    VideoComponent,
    StatisticComponent,
    ErrorComponent,
  ],
  templateUrl: './layout.component.html',
  styleUrl: './layout.component.scss',
})
export class LayoutComponent {}

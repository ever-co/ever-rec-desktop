import { CommonModule } from '@angular/common';
import { Component } from '@angular/core';
import { MatCardModule } from '@angular/material/card';
import { VideoGalleryComponent } from '@ever-co/convert-video-feature';
import {
  ScreenshotGalleryComponent,
  ScreenshotStatisticComponent,
} from '@ever-co/screenshot-feature';
import { ScreenshotComponent } from '../screenshot/screenshot.component';
import { StateComponent } from '../state/state.component';
import { TimeLogStaComponent } from '../timelog-stat/timelog-stat.component';
import { VideoComponent } from '../video/video.component';

@Component({
  selector: 'lib-dashboard',
  standalone: true,
  imports: [
    CommonModule,
    MatCardModule,
    ScreenshotGalleryComponent,
    VideoGalleryComponent,
    ScreenshotStatisticComponent,
    ScreenshotComponent,
    VideoComponent,
    StateComponent,
    TimeLogStaComponent,
  ],
  templateUrl: './dashboard.component.html',
  styleUrl: './dashboard.component.scss',
})
export class DashboardComponent {}

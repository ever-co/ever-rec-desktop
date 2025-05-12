import { CommonModule } from '@angular/common';
import { Component } from '@angular/core';
import { MatButtonModule } from '@angular/material/button';
import { MatCardModule } from '@angular/material/card';
import { MatIconModule } from '@angular/material/icon';
import { MatTooltipModule } from '@angular/material/tooltip';
import { RouterLink } from '@angular/router';
import {
  AnalysisComponent,
  DistributionComponent,
} from '@ever-co/activity-feature';
import { VideoGalleryComponent } from '@ever-co/video-feature';
import {
  ScreenshotGalleryComponent,
  ScreenshotStatisticComponent,
} from '@ever-co/screenshot-feature';
import { GreetingPipe } from '@ever-co/shared-service';
import { ScreenshotWidgetComponent } from '@ever-co/screenshot-feature';
import { StateComponent } from '../state/state.component';
import { TimesheetWidgetComponent } from '@ever-co/timesheet-feature';
import { VideoWidgetComponent } from '@ever-co/video-feature';
import { AudioWidgetComponent } from '@ever-co/audio-feature';
import { PhotoWidgetComponent } from '@ever-co/photo-feature';

@Component({
  selector: 'lib-dashboard',
  imports: [
    CommonModule,
    MatCardModule,
    ScreenshotGalleryComponent,
    VideoGalleryComponent,
    ScreenshotStatisticComponent,
    ScreenshotWidgetComponent,
    VideoWidgetComponent,
    StateComponent,
    TimesheetWidgetComponent,
    PhotoWidgetComponent,
    AudioWidgetComponent,
    RouterLink,
    MatIconModule,
    MatTooltipModule,
    MatButtonModule,
    GreetingPipe,
    AnalysisComponent,
    DistributionComponent,
  ],
  templateUrl: './dashboard.component.html',
  styleUrl: './dashboard.component.scss',
})
export class DashboardComponent {}

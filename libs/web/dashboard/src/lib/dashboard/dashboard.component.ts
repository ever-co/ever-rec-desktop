import { CommonModule } from '@angular/common';
import { Component } from '@angular/core';
import { MatButtonModule } from '@angular/material/button';
import { MatCardModule } from '@angular/material/card';
import { MatIconModule } from '@angular/material/icon';
import { MatTooltipModule } from '@angular/material/tooltip';
import { RouterLink } from '@angular/router';
import { AnalysisComponent, DistributionComponent } from '@ever-co/activity-feature';
import { VideoGalleryComponent } from '@ever-co/convert-video-feature';
import {
  ScreenshotGalleryComponent,
  ScreenshotStatisticComponent,
} from '@ever-co/screenshot-feature';
import { GreetingPipe } from '@ever-co/shared-service';
import { ScreenshotComponent } from '../screenshot/screenshot.component';
import { StateComponent } from '../state/state.component';
import { TimeLogStaComponent } from '../timelog-stat/timelog-stat.component';
import { VideoComponent } from '../video/video.component';

@Component({
    selector: 'lib-dashboard',
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
        RouterLink,
        MatIconModule,
        MatTooltipModule,
        MatButtonModule,
        GreetingPipe,
        AnalysisComponent,
        DistributionComponent
    ],
    templateUrl: './dashboard.component.html',
    styleUrl: './dashboard.component.scss'
})
export class DashboardComponent {}

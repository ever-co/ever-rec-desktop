import { CommonModule } from '@angular/common';
import { ChangeDetectionStrategy, Component, inject } from '@angular/core';
import { MatButtonModule } from '@angular/material/button';
import { MatCardModule } from '@angular/material/card';
import { MatIconModule } from '@angular/material/icon';
import { MatTooltipModule } from '@angular/material/tooltip';
import { RouterLink } from '@angular/router';
import {
  AnalysisComponent,
  DistributionComponent,
  TopAppsComponent,
} from '@ever-co/activity-feature';
import { AudioWidgetComponent } from '@ever-co/audio-feature';
import { PhotoWidgetComponent } from '@ever-co/photo-feature';
import {
  ScreenshotGalleryComponent,
  ScreenshotStatisticComponent,
  ScreenshotWidgetComponent,
} from '@ever-co/screenshot-feature';
import { GreetingPipe } from '@ever-co/shared-service';
import {
  TimesheetHeatMapWidgetComponent,
  TimesheetWidgetComponent,
} from '@ever-co/timesheet-feature';
import {
  VideoGalleryComponent,
  VideoWidgetComponent,
} from '@ever-co/video-feature';
import { StateComponent } from '../state/state.component';
import { selectUser } from '@ever-co/auth-data-access';
import { Store } from '@ngrx/store';
import { Observable } from 'rxjs';
import { IUser } from '@ever-co/shared-utils';

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
    TimesheetHeatMapWidgetComponent,
    TopAppsComponent
  ],
  templateUrl: './dashboard.component.html',
  styleUrl: './dashboard.component.scss',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class DashboardComponent {
  public readonly store = inject(Store);

  public get user$(): Observable<IUser | null> {
    return this.store.select(selectUser);
  }
}

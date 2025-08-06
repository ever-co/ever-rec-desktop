import {
  ApplicationConfig,
  isDevMode,
  provideZoneChangeDetection,
} from '@angular/core';
import { provideAnimationsAsync } from '@angular/platform-browser/animations/async';
import {
  provideRouter,
  withHashLocation,
  withViewTransitions,
} from '@angular/router';
import { provideActivityDataAccess } from '@ever-co/activity-data-access';
import { provideAudioPlayerDataAccess } from '@ever-co/audio-data-access';
import { provideAuthDataAccess } from '@ever-co/auth-data-access';
import { provideBreadcrumbDataAccess } from '@ever-co/breadcrumb-data-access';
import { provideDatePickerDataAccess } from '@ever-co/date-picker-data-access';
import {
  provideFactoriesDataAccess,
  provideHydrationDataAccess,
  provideMediatorDataAccess,
} from '@ever-co/factory';
import { provideGenerateVideoDataAccess } from '@ever-co/generate-video-data-access';
import { provideNotificationDataAccess } from '@ever-co/notification-data-access';
import { providePhotoDataAccess } from '@ever-co/photo-data-access';
import { provideScreenshotDataAccess } from '@ever-co/screenshot-data-access';
import { REC_ENV } from '@ever-co/shared-service';
import { provideSidebarDataAccess } from '@ever-co/sidebar-data-access';
import { provideTimelineDataAccess } from '@ever-co/timeline-data-access';
import { provideTimeLogDataAccess } from '@ever-co/timesheet-data-access';
import { provideUploadDataAccess } from '@ever-co/upload-data-access';
import { provideUserDataAccess } from '@ever-co/user-data-access';
import { provideVideoDataAccess } from '@ever-co/video-data-access';
import { provideSettingsDataAccess } from '@ever-co/web-setting-data-access';
import { provideWebcamDataAccess } from '@ever-co/webcam-data-access';
import { provideEffects } from '@ngrx/effects';
import { provideStore } from '@ngrx/store';
import { provideStoreDevtools } from '@ngrx/store-devtools';
import { Environment } from '../environment/environment';
import { appRoutes } from './app.routes';
import { provideCoreDataAccess } from '@ever-co/core-data-access';

export const appConfig: ApplicationConfig = {
  providers: [
    provideScreenshotDataAccess(),
    provideBreadcrumbDataAccess(),
    provideVideoDataAccess(),
    provideGenerateVideoDataAccess(),
    provideSidebarDataAccess(),
    provideSettingsDataAccess(),
    provideStoreDevtools({ logOnly: !isDevMode() }),
    provideEffects(),
    provideStore(),
    provideZoneChangeDetection({ eventCoalescing: true }),
    provideRouter(appRoutes, withViewTransitions(), withHashLocation()),
    provideAnimationsAsync(),
    provideDatePickerDataAccess(),
    provideTimeLogDataAccess(),
    provideFactoriesDataAccess(),
    provideNotificationDataAccess(),
    provideUploadDataAccess(),
    provideTimelineDataAccess(),
    provideActivityDataAccess(),
    provideWebcamDataAccess(),
    provideHydrationDataAccess(),
    provideMediatorDataAccess(),
    provideAudioPlayerDataAccess(),
    providePhotoDataAccess(),
    provideUserDataAccess(),
    provideAuthDataAccess(),
    provideCoreDataAccess(),
    {
      provide: REC_ENV,
      useClass: Environment,
    },
  ],
};

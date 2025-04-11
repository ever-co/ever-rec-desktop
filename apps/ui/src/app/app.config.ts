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
import { provideBreadcrumbDataAccess } from '@ever-co/breadcrumb-data-access';
import { provideConvertVideoDataAccess } from '@ever-co/convert-video-data-access';
import { provideFactoriesDataAccess } from '@ever-co/factory';
import { provideNotificationDataAccess } from '@ever-co/notification-data-access';
import { provideScreenshotDataAccess } from '@ever-co/screenshot-data-access';
import { provideDatePickerDataAccess } from '@ever-co/shared-service';
import { provideSidebarDataAccess } from '@ever-co/sidebar-data-access';
import { provideTimelineDataAccess } from '@ever-co/timeline-data-access';
import { provideTimeLogDataAccess } from '@ever-co/timesheet-data-access';
import { provideUploadDataAccess } from '@ever-co/upload-data-access';
import { provideSettingsDataAccess } from '@ever-co/web-setting-data-access';
import { provideWebcamDataAccess } from '@ever-co/webcam-data-access';
import { provideEffects } from '@ngrx/effects';
import { provideStore } from '@ngrx/store';
import { provideStoreDevtools } from '@ngrx/store-devtools';
import { appRoutes } from './app.routes';

export const appConfig: ApplicationConfig = {
  providers: [
    provideScreenshotDataAccess(),
    provideBreadcrumbDataAccess(),
    provideConvertVideoDataAccess(),
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
  ],
};

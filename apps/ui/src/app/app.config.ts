import { ApplicationConfig, isDevMode, provideZoneChangeDetection } from '@angular/core';
import { provideAnimationsAsync } from '@angular/platform-browser/animations/async';
import {
  provideRouter
} from '@angular/router';
import { provideBreadcrumbDataAccess } from '@ever-co/breadcrumb-data-access';
import { provideConvertVideoDataAccess } from '@ever-co/convert-video-data-access';
import { provideScreenshotDataAccess } from '@ever-co/screenshot-data-access';
import { provideSidebarDataAccess } from '@ever-co/sidebar-data-access';
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
    provideStoreDevtools({ logOnly: !isDevMode() }),
    provideEffects(),
    provideStore(),
    provideZoneChangeDetection({ eventCoalescing: true }),
    provideRouter(appRoutes),
    provideAnimationsAsync(),
  ],
};

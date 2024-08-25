import { ApplicationConfig } from '@angular/core';
import { provideClientHydration } from '@angular/platform-browser';
import { provideRouter } from '@angular/router';
import { provideBreadcrumbDataAccess } from '@ever-capture/breadcrumb-data-access';
import { provideConvertVideoDataAccess } from '@ever-capture/convert-video-data-access';
import { provideScreenshotDataAccess } from '@ever-capture/screenshot-data-access';
import { provideEffects } from '@ngrx/effects';
import { provideStore } from '@ngrx/store';
import { appRoutes } from './app.routes';

export const appConfig: ApplicationConfig = {
  providers: [
    provideClientHydration(),
    provideEffects(),
    provideStore(),
    provideScreenshotDataAccess(),
    provideBreadcrumbDataAccess(),
    provideConvertVideoDataAccess(),
    provideRouter(appRoutes),
  ],
};

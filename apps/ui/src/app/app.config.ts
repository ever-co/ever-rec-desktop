import { ApplicationConfig } from '@angular/core';
import { provideClientHydration } from '@angular/platform-browser';
import { provideRouter } from '@angular/router';
import { provideEffects } from '@ngrx/effects';
import { provideStore } from '@ngrx/store';
import { provideBreadcrumbDataAccess } from '@prototype/breadcrumb/data-access';
import { provideConvertVideoDataAccess } from '@prototype/web/convert-video/data-access';
import { provideScreenshotDataAccess } from '@prototype/web/screenshot/data-access';
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

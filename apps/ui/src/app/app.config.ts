import { ApplicationConfig } from '@angular/core';
import { provideClientHydration } from '@angular/platform-browser';
import { provideAnimationsAsync } from '@angular/platform-browser/animations/async';
import { provideRouter } from '@angular/router';
import { provideBreadcrumbDataAccess } from '@ever-co/breadcrumb-data-access';
import { provideConvertVideoDataAccess } from '@ever-co/convert-video-data-access';
import { provideScreenshotDataAccess } from '@ever-co/screenshot-data-access';
import { provideSidebarDataAccess } from '@ever-co/sidebar-data-access';
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
    provideSidebarDataAccess(),
    provideRouter(appRoutes), provideAnimationsAsync(),
  ],
};

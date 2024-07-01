import { ApplicationConfig } from '@angular/core';
import { provideRouter } from '@angular/router';
import { provideEffects } from '@ngrx/effects';
import { provideStore } from '@ngrx/store';
import { provideScreenshotCategoryDataAccess } from '@prototype/web/screenshot/data-access';
import { appRoutes } from './app.routes';

export const appConfig: ApplicationConfig = {
  providers: [
    provideEffects(),
    provideStore(),
    provideScreenshotCategoryDataAccess(),
    provideRouter(appRoutes),
  ],
};

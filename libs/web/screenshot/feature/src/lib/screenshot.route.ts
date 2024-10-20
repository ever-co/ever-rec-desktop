import { Route } from '@angular/router';

export const screenshotRoutes: Route[] = [
  {
    path: '',
    loadComponent: () =>
      import('@ever-co/shared-components').then((m) => m.GalleryComponent),
  },
  {
    path: ':id',
    loadComponent: () =>
      import('./screenshot/screenshot.component').then(
        (m) => m.ScreenshotComponent
      ),
  },
];

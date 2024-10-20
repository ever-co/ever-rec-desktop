import { Route } from '@angular/router';

export const screenshotRoutes: Route[] = [
  {
    path: '',
    loadComponent: () =>
      import('./screenshot-gallery/screenshot-gallery.component').then(
        (m) => m.ScreenshotGalleryComponent
      ),
  },
  {
    path: ':id',
    loadComponent: () =>
      import('./screenshot/screenshot.component').then(
        (m) => m.ScreenshotComponent
      ),
  },
];

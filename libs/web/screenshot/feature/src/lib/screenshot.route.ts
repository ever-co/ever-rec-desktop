import { Route } from '@angular/router';

export const screenshotRoutes: Route[] = [
  {
    path: '',
    title: 'Memory Keeper',
    loadComponent: () =>
      import('./gallery/gallery.component').then((c) => c.GalleryComponent),
  },
  {
    path: 'convert',
    title: 'Memory Keeper',
    loadChildren: () =>
      import('@prototype/web/convert-video/feature').then(
        (r) => r.convertVideoRoutes
      ),
  },
];

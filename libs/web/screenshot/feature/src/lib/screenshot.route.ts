import { Route } from '@angular/router';
import { timelineGuard } from '@prototype/web/convert-video/data-access';

export const screenshotRoutes: Route[] = [
  {
    path: '',
    title: 'Memory Keeper',
    loadComponent: () =>
      import('@prototype/shared/component').then((c) => c.GalleryComponent),
  },
  {
    path: 'convert',
    title: 'Memory Keeper',
    loadChildren: () =>
      import('@prototype/web/convert-video/feature').then(
        (r) => r.convertVideoRoutes
      ),
  },
  {
    path: 'timeline',
    title: 'Memory Keeper',
    canActivate: [timelineGuard],
    loadComponent: () =>
      import('@prototype/web/convert-video/feature').then(
        (r) => r.TimelineComponent
      ),
  },
];

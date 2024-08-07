import { Route } from '@angular/router';
import { timelineGuard } from '@ever-capture/web/convert-video/data-access';

export const screenshotRoutes: Route[] = [
  {
    path: '',
    title: 'Memory Keeper',
    loadComponent: () =>
      import('@ever-capture/shared/component').then((c) => c.GalleryComponent),
  },
  {
    path: 'convert',
    title: 'Memory Keeper',
    loadChildren: () =>
      import('@ever-capture/web/convert-video/feature').then(
        (r) => r.convertVideoRoutes
      ),
  },
  {
    path: 'timeline',
    title: 'Memory Keeper',
    canActivate: [timelineGuard],
    loadComponent: () =>
      import('@ever-capture/web/convert-video/feature').then(
        (r) => r.TimelineComponent
      ),
  },
];

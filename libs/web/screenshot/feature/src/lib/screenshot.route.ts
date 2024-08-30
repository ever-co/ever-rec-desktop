import { Route } from '@angular/router';
import { timelineGuard } from '@ever-capture/convert-video-data-access';

export const screenshotRoutes: Route[] = [
  {
    path: '',
    title: 'Memory Keeper',
    loadComponent: () =>
      import('@ever-capture/shared-components').then((c) => c.GalleryComponent),
  },
  {
    path: 'convert',
    title: 'Memory Keeper',
    loadChildren: () =>
      import('@ever-capture/convert-video-feature').then(
        (r) => r.convertVideoRoutes
      ),
  },
  {
    path: 'timeline',
    title: 'Memory Keeper',
    canActivate: [timelineGuard],
    loadComponent: () =>
      import('@ever-capture/convert-video-feature').then(
        (r) => r.TimelineComponent
      ),
  },
];

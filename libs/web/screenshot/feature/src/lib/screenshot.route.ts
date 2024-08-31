import { Route } from '@angular/router';
import { timelineGuard } from '@ever-co/convert-video-data-access';

export const screenshotRoutes: Route[] = [
  {
    path: '',
    title: 'Memory Keeper',
    loadComponent: () =>
      import('@ever-co/shared-components').then((c) => c.GalleryComponent),
  },
  {
    path: 'convert',
    title: 'Memory Keeper',
    loadChildren: () =>
      import('@ever-co/convert-video-feature').then(
        (r) => r.convertVideoRoutes
      ),
  },
  {
    path: 'timeline',
    title: 'Memory Keeper',
    canActivate: [timelineGuard],
    loadComponent: () =>
      import('@ever-co/convert-video-feature').then(
        (r) => r.TimelineComponent
      ),
  },
];

import { Route } from '@angular/router';
import { timelineGuard } from '@ever-co/convert-video-data-access';

export const screenshotRoutes: Route[] = [
  {
    path: 'library',
    title: 'Continues Recording',
    loadChildren: () =>
      import('@ever-co/library').then(
        (r) => r.libraryRoutes
      ),
  },
  {
    path: 'settings',
    title: 'Continues Recording',
    loadChildren: () =>
      import('@ever-co/convert-video-feature').then(
        (r) => r.convertVideoRoutes
      ),
  },
  {
    path: 'timeline',
    title: 'Continues Recording',
    canActivate: [timelineGuard],
    loadComponent: () =>
      import('@ever-co/convert-video-feature').then(
        (r) => r.TimelineComponent
      ),
  },
];

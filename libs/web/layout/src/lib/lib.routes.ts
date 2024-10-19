import { Route } from '@angular/router';
import { timelineGuard } from '@ever-co/convert-video-data-access';

export const layoutRoutes: Route[] = [
  { path: '', redirectTo: '', pathMatch: 'full' },
  {
    path: '',
    title: 'Continues Recording',
    loadComponent: () =>
      import('./layout/layout.component').then((c) => c.LayoutComponent),
    children: [
      { path: '', redirectTo: 'home', pathMatch: 'full' },
      {
        path: 'home',
        loadComponent: () =>
          import('@ever-co/convert-video-feature').then(
            (r) => r.StatisticComponent
          ),
      },
      {
        path: 'library',
        loadChildren: () =>
          import('@ever-co/library').then((r) => r.libraryRoutes),
      },
      {
        path: 'settings',
        loadChildren: () =>
          import('@ever-co/convert-video-feature').then(
            (r) => r.convertVideoRoutes
          ),
      },
      {
        path: 'timeline',
        canActivate: [timelineGuard],
        loadComponent: () =>
          import('@ever-co/convert-video-feature').then(
            (r) => r.TimelineComponent
          ),
      },
    ],
  },
];

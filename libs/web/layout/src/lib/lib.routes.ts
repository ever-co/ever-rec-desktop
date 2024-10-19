import { Route } from '@angular/router';
import { timelineGuard } from '@ever-co/convert-video-data-access';

export const layoutRoutes: Route[] = [
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
        loadComponent: () =>
          import('@ever-co/convert-video-feature').then(
            (r) => r.SettingComponent
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
      { path: '**', redirectTo: '' },
    ],
  },
  { path: '**', redirectTo: '' },
];

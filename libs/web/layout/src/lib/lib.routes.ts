import { Route } from '@angular/router';
import { timelineGuard } from '@ever-co/convert-video-data-access';

export const layoutRoutes: Route[] = [
  {
    path: '',
    title: 'Continues Recording',
    loadComponent: () =>
      import('./layout/layout.component').then((c) => c.LayoutComponent),
    children: [
      { path: '', redirectTo: 'dashboard', pathMatch: 'full' },
      {
        path: 'dashboard',
        loadComponent: () =>
          import('@ever-co/web-dashboard').then(
            (r) => r.DashboardComponent
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
          import('@ever-co/web-setting-feature').then((r) => r.settingRoutes),
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

import { Route } from '@angular/router';
import { timelineGuard } from '@ever-co/timeline-data-access';

export const layoutRoutes: Route[] = [
  { path: '', redirectTo: '', pathMatch: 'full' },
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
          import('@ever-co/web-dashboard').then((r) => r.DashboardComponent),
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
        path: 'timesheet',
        loadChildren: () =>
          import('@ever-co/timesheet-feature').then(
            (r) => r.timesheetFeatureRoutes
          ),
      },
      {
        path: 'activities',
        loadComponent: () =>
          import('@ever-co/screenshot-feature').then(
            (r) => r.ScreenshotStatisticComponent
          ),
      },
      {
        path: 'timeline',
        canActivate: [timelineGuard],
        loadComponent: () =>
          import('@ever-co/timeline-feature').then(
            (r) => r.TimelineContainerComponent
          ),
      },
      {
        path: 'search',
        loadComponent: () =>
          import('@ever-co/screenshot-feature').then(
            (r) => r.ScreenshotSearchComponent
          ),
      },
      { path: '**', redirectTo: '' },
    ],
  },
  { path: '**', redirectTo: '' },
];

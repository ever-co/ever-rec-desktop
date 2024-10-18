import { Route } from '@angular/router';

export const layoutRoutes: Route[] = [
  {
    path: '',
    title: 'Continues Recording',
    loadComponent: () =>
      import('./layout/layout.component').then((c) => c.LayoutComponent),
    loadChildren: () =>
      import('@ever-co/screenshot-feature').then((r) => r.screenshotRoutes),
  },
];

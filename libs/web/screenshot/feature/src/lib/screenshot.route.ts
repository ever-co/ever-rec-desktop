import { Route } from '@angular/router';

export const screenshotRoutes: Route[] = [
  {
    path: '',
    title: 'Memory Keeper',
    loadComponent: () =>
      import('./layout/layout.component').then((c) => c.LayoutComponent),
  },
];

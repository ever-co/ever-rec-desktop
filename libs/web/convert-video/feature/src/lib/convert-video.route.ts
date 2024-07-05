import { Route } from '@angular/router';

export const convertVideoRoutes: Route[] = [
  {
    path: '',
    title: 'Memory Keeper',
    loadComponent: () =>
      import('./layout/layout.component').then((c) => c.LayoutComponent),
  },
];

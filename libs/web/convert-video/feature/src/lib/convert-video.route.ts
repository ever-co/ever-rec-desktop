import { Route } from '@angular/router';

export const convertVideoRoutes: Route[] = [
  {
    path: '',
    title: 'Continues Recording',
    loadComponent: () =>
      import('./layout/layout.component').then((c) => c.LayoutComponent),
  },
];

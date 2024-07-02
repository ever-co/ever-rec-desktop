import { Route } from '@angular/router';

export const convertVideoRoutes: Route[] = [
  {
    path: '',
    title: 'Memory Keeper | Convert Video',
    loadComponent: () =>
      import('./layout/layout.component').then((c) => c.LayoutComponent),
  },
];

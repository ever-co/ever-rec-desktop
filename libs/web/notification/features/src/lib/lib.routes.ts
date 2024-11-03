import { Route } from '@angular/router';

export const notificationRoutes: Route[] = [
  {
    path: '',
    loadComponent: () =>
      import('./list/list.component').then((m) => m.ListComponent),
  },
];

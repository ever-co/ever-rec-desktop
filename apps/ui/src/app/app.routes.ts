import { Route } from '@angular/router';

export const appRoutes: Route[] = [
  {
    path: '',
    loadChildren: () =>
      import('@ever-co/layout').then((m) => m.layoutRoutes),
  },
];

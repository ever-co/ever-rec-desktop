import { Route } from '@angular/router';

export const appRoutes: Route[] = [
  {
    path: '',
    loadChildren: () =>
      import('@ever-co/screenshot-feature').then((m) => m.layoutRoutes),
  },
];

import { Route } from '@angular/router';

export const appRoutes: Route[] = [
  {
    path: '',
    loadChildren: () =>
      import('@ever-capture/screenshot-feature').then((m) => m.layoutRoutes),
  },
];

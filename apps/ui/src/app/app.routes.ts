import { Route } from '@angular/router';

export const appRoutes: Route[] = [
  {
    path: '',
    loadChildren: () =>
      import('@ever-capture/web/screenshot/feature').then((m) => m.layoutRoutes),
  },
];

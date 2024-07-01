import { Route } from '@angular/router';

export const appRoutes: Route[] = [
  {
    path: '',
    loadChildren: () =>
      import('@prototype/web/screenshot/feature').then(
        (m) => m.screenshotRoutes
      ),
  },
];

import { Route } from '@angular/router';

export const appRoutes: Route[] = [
  {
    path: '',
    pathMatch: 'full',
    loadChildren: () => import('@ever-co/layout').then((m) => m.layoutRoutes),
  },
  {
    path: 'webcam',
    loadChildren: () =>
      import('@ever-co/webcam-feature').then((m) => m.webcamRoutes),
  },
];

import { Routes } from '@angular/router';

export const appRoutes: Routes = [
  { path: '', redirectTo: '', pathMatch: 'full' },
  {
    path: 'webcam',
    loadChildren: () =>
      import('@ever-co/webcam-feature').then(
        ({ webcamRoutes }) => webcamRoutes
      ),
  },
  {
    path: '',
    loadChildren: () =>
      import('@ever-co/layout').then(({ layoutRoutes }) => layoutRoutes),
  },
];

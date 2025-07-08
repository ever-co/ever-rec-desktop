import { Routes } from '@angular/router';
import { authGuard } from '@ever-co/auth-data-access';

export const appRoutes: Routes = [
  { path: '', redirectTo: '', pathMatch: 'full' },
  {
    path: 'webcam',
    loadChildren: () =>
      import('@ever-co/webcam-feature').then(
        ({ webcamRoutes }) => webcamRoutes,
      ),
  },
  {
    path: 'auth',
    loadChildren: () =>
      import('@ever-co/auth-feature').then(({ authRoutes }) => authRoutes),
  },
  {
    path: '',
    canActivate: [authGuard],
    loadChildren: () =>
      import('@ever-co/layout').then(({ layoutRoutes }) => layoutRoutes),
  },
];

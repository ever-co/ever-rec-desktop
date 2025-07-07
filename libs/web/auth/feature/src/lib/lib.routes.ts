import { Route } from '@angular/router';

export const authRoutes: Route[] = [
  { path: '', redirectTo: 'login', pathMatch: 'full' },
  {
    path: 'login',
    loadComponent: () =>
      import('./login-page/login-page.component').then(
        (m) => m.LoginPageComponent,
      ),
  },
];

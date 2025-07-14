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
  {
    path: 'sign-up',
    loadComponent: () =>
      import('./sign-up-page/sign-up-page.component').then(
        (m) => m.SignUpPageComponent,
      ),
  },
];

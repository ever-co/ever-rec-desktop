import { Route } from '@angular/router';

export const userRoutes: Route[] = [
  {
    path: '',
    loadComponent: () =>
      import('./user-profile/user-profile.component').then(
        (m) => m.UserProfileComponent,
      ),
  },
];

import { Route } from '@angular/router';

export const libraryRoutes: Route[] = [
  {
    path: '',
    loadComponent: () =>
      import('./library.component').then((m) => m.LibraryComponent)
  },
];

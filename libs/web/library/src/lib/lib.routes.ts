import { Route } from '@angular/router';

export const libraryRoutes: Route[] = [
  {
    path: '',
    loadComponent: () =>
      import('./library.component').then((m) => m.LibraryComponent),
    children: [
      {
        path: 'screenshots',
        loadComponent: () =>
          import('@ever-co/shared-components').then((m) => m.GalleryComponent),
      },
    ]
  },
];

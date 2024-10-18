import { Route } from '@angular/router';

export const libraryRoutes: Route[] = [
  {
    path: '',
    loadComponent: () =>
      import('./library.component').then((m) => m.LibraryComponent),
    children: [
      { path: '', redirectTo: 'videos', pathMatch: 'full' },
      {
        path: 'videos',
        loadComponent: () =>
          import('@ever-co/shared-components').then((m) => m.GalleryComponent),
      },
      {
        path: 'archive',
        loadComponent: () =>
          import('@ever-co/shared-components').then((m) => m.GalleryComponent),
      },
      {
        path: 'screenshots',
        loadComponent: () =>
          import('@ever-co/shared-components').then((m) => m.GalleryComponent),
      },
    ],
  },
];

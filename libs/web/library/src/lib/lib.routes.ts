import { Route } from '@angular/router';

export const libraryRoutes: Route[] = [
  { path: '', redirectTo: '', pathMatch: 'full' },
  {
    path: '',
    loadComponent: () =>
      import('./library.component').then((m) => m.LibraryComponent),
    children: [
      { path: '', redirectTo: 'videos', pathMatch: 'full' },
      {
        path: 'videos',
        loadComponent: () =>
          import('@ever-co/convert-video-feature').then(
            (m) => m.VideoComponent
          ),
      },
      {
        path: 'screenshots',
        loadComponent: () =>
          import('@ever-co/shared-components').then((m) => m.GalleryComponent),
      },
    ],
  },
];

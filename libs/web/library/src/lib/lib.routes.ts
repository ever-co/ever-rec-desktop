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
            (m) => m.VideoGalleryComponent
          ),
      },
      {
        path: 'screenshots',
        loadChildren: () =>
          import('@ever-co/screenshot-feature').then((m) => m.screenshotRoutes),
      },
      { path: '**', redirectTo: '' },
    ],
  },
  { path: '**', redirectTo: '' },
];

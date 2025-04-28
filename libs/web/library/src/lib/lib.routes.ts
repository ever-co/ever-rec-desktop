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
        loadChildren: () =>
          import('@ever-co/convert-video-feature').then((m) => m.videoRoutes),
      },
      {
        path: 'screenshots',
        loadChildren: () =>
          import('@ever-co/screenshot-feature').then((m) => m.screenshotRoutes),
      },
      {
        path: 'webcams',
        loadChildren: () =>
          import('@ever-co/webcam-feature').then((m) => m.libraryRoutes),
      },
      { path: '**', redirectTo: '' },
    ],
  },
  { path: '**', redirectTo: '' },
];

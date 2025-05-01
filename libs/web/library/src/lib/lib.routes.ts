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
        path: 'photos',
        loadChildren: () =>
          import('@ever-co/photo-feature').then((m) => m.photoRoutes),
      },
      {
        path: 'audios',
        loadChildren: () =>
          import('@ever-co/audio-feature').then((m) => m.audioRoutes),
      },
      { path: '**', redirectTo: '' },
    ],
  },
  { path: '**', redirectTo: '' },
];

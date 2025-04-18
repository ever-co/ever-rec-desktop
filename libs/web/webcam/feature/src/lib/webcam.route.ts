import { Route } from '@angular/router';

export const settingRoutes: Route[] = [
  { path: '', redirectTo: '', pathMatch: 'full' },
  {
    path: '',
    loadComponent: () =>
      import('./setting/setting.component').then((m) => m.SettingComponent),
    children: [
      { path: '', redirectTo: 'preview', pathMatch: 'full' },
      {
        path: 'preview',
        loadComponent: () =>
          import('./preview/preview.component').then((m) => m.PreviewComponent),
      },
      { path: '**', redirectTo: '' },
    ],
  },
  { path: '**', redirectTo: '' },
];

export const libraryRoutes: Route[] = [
  { path: '', redirectTo: '', pathMatch: 'full' },
  {
    path: '',
    loadComponent: () =>
      import('./gallery/gallery.component').then((m) => m.GalleryComponent),
  },
  {
    path: ':id',
    loadComponent: () =>
      import('./photo/photo.component').then((m) => m.PhotoComponent),
  },
  { path: '**', redirectTo: '' },
];

export const webcamRoutes: Route[] = [
  { path: '', redirectTo: '', pathMatch: 'full' },
  {
    path: '',
    loadComponent: () =>
      import('./webcam/webcam.component').then((m) => m.WebcamComponent),
  },
  { path: '**', redirectTo: '' },
];

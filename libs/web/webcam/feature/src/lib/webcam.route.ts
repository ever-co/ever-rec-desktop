import { Route } from '@angular/router';

export const settingRoutes: Route[] = [
  { path: '', redirectTo: '', pathMatch: 'full' },
  {
    path: '',
    loadComponent: () =>
      import('./setting/setting.component').then((m) => m.SettingComponent),
    loadChildren: () => import('./camera/camera.route').then((m) => m.routes),
  },
  { path: '**', redirectTo: '' },
];

export const libraryRoutes: Route[] = [
  { path: '', redirectTo: '', pathMatch: 'full' },
  {
    path: 'photos',
    loadChildren: () =>
      import('./photo/photo.route').then((m) => m.photoRoutes),
  },
  {
    path: 'audios',
    loadChildren: () =>
      import('./audio/audio.route').then((m) => m.audioRoutes),
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

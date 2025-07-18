import { Route } from '@angular/router';

export const settingRoutes: Route[] = [
  { path: '', redirectTo: '', pathMatch: 'full' },
  {
    path: '',
    loadComponent: () =>
      import('./setting/setting.component').then((m) => m.SettingComponent),
    children: [
      { path: '', redirectTo: 'generate-video-settings', pathMatch: 'full' },
      {
        path: 'generate-video-settings',
        loadComponent: () =>
          import('@ever-co/generate-video-feature').then(
            (m) => m.GenerateVideoSettingComponent,
          ),
      },
      {
        path: 'screen-capture-settings',
        loadComponent: () =>
          import('@ever-co/screenshot-feature').then((m) => m.SettingComponent),
      },
      {
        path: 'storage',
        loadComponent: () =>
          import('./storage/storage.component').then((m) => m.StorageComponent),
      },
      {
        path: 'webcam',
        loadChildren: () =>
          import('@ever-co/webcam-feature').then((m) => m.settingRoutes),
      },
      {
        path: 'user-profile',
        loadChildren: () =>
          import('@ever-co/user-feature').then((m) => m.userRoutes),
      },
      { path: '**', redirectTo: '' },
    ],
  },
  { path: '**', redirectTo: '' },
];

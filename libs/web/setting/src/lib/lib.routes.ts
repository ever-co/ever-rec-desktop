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
          import('@ever-co/convert-video-feature').then(
            (m) => m.SettingComponent
          ),
      },
      {
        path: 'screen-capture-settings',
        loadComponent: () =>
          import('@ever-co/screenshot-feature').then((m) => m.SettingComponent),
      },
      { path: '**', redirectTo: '' },
    ],
  },
  { path: '**', redirectTo: '' },
];

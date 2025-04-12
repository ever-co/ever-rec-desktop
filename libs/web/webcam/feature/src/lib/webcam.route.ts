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

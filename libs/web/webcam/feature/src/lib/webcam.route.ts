import { Route } from '@angular/router';

export const settingRoutes: Route[] = [
  { path: '', redirectTo: '', pathMatch: 'full' },
  {
    path: '',
    loadComponent: () =>
      import('./setting/setting.component').then((m) => m.SettingComponent),
  },
  { path: '**', redirectTo: '' },
];

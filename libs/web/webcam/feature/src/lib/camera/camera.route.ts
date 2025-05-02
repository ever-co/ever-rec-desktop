import { Routes } from '@angular/router';

export const routes: Routes = [
  { path: '', redirectTo: 'preview', pathMatch: 'full' },
  {
    path: 'preview',
    loadComponent: () =>
      import('./preview/preview.component').then((m) => m.PreviewComponent),
  },
  { path: '**', redirectTo: '' },
];

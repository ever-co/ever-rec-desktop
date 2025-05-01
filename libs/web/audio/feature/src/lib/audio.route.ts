import { Route } from '@angular/router';

export const audioRoutes: Route[] = [
  { path: '', redirectTo: '', pathMatch: 'full' },
  {
    path: '',
    loadComponent: () =>
      import('./gallery/gallery.component').then((m) => m.GalleryComponent),
  },

  { path: '**', redirectTo: '' },
];

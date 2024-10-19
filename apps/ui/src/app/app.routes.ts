import { Route } from '@angular/router';

export const appRoutes: Route[] = [
  { path: '', redirectTo: '', pathMatch: 'full' },
  {
    path: '',
    loadChildren: () => import('@ever-co/layout').then((m) => m.layoutRoutes),
  },
  { path: '**', redirectTo: '' },
];

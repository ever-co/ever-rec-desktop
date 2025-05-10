import { Route } from '@angular/router';

export const videoRoutes: Route[] = [
  {
    path: '',
    loadComponent: () =>
      import('./video-gallery/video-gallery.component').then(
        (m) => m.VideoGalleryComponent
      ),
  },
  {
    path: ':id',
    loadComponent: () =>
      import('./video-detail/video-detail.component').then(
        (m) => m.VideoDetailComponent
      ),
  },
];

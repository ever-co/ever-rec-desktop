import { inject, provideAppInitializer } from '@angular/core';
import {
  cameraActions,
  photoActions,
  PhotoService,
  selectCameraAuthorizations,
} from '@ever-co/webcam-data-access';
import { Store } from '@ngrx/store';
import { filter, map, withLatestFrom } from 'rxjs';

export function autoTrackingFactory(
  store: Store,
  service: PhotoService
): () => void {
  return () => {
    service
      .requestTracking()
      .pipe(
        withLatestFrom(store.select(selectCameraAuthorizations)),
        filter(([, auth]) => auth.isAuthorized && auth.canUseCamera),
        map(() => store.dispatch(photoActions.startTracking()))
      )
      .subscribe();

    store.dispatch(cameraActions.loadCameras());
  };
}

export const autoTrackingProvider = provideAppInitializer(() => {
  const initializerFn = autoTrackingFactory(
    inject(Store),
    inject(PhotoService)
  );
  return initializerFn();
});

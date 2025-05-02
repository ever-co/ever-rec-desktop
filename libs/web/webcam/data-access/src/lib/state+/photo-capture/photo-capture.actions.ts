import { IPhoto, IPhotoSave } from '@ever-co/shared-utils';
import { createActionGroup, emptyProps, props } from '@ngrx/store';

export const photoCaptureActions = createActionGroup({
  source: 'PhotoCapture',
  events: {
    'Save Photo': props<IPhotoSave>(),
    'Save Photo Success': props<{ photo: IPhoto }>(),
    'Save Photo Failure': props<{ error: string }>(),

    'Start Tracking': emptyProps(),
    'Start Tracking Success': emptyProps(),
    'Start Tracking Failure': props<{ error: string }>(),

    'Stop Tracking': emptyProps(),
    'Stop Tracking Success': emptyProps(),
    'Stop Tracking Failure': props<{ error: string }>(),
  },
});

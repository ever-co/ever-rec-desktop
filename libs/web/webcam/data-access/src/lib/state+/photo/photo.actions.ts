import { IPhoto } from '@ever-co/shared-utils';
import { createActionGroup, emptyProps, props } from '@ngrx/store';

export const photoActions = createActionGroup({
  source: 'Photo',
  events: {
    'Load Photos': emptyProps(),
    'Load Photos Success': props<{ photos: IPhoto[] }>(),
    'Load Photos Failure': props<{ error: string }>(),
    'Save Photo': props<{ dataURL: string }>(),
    'Save Photo Success': emptyProps(),
    'Save Photo Failure': props<{ error: string }>(),
  },
});

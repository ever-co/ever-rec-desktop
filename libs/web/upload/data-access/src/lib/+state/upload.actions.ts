import { IPhoto, IUpload, IVideo } from '@ever-co/shared-utils';
import { createActionGroup, emptyProps, props } from '@ngrx/store';

export const uploadActions = createActionGroup({
  source: 'Upload',
  events: {
    'In Progress': props<{ config: IUpload }>(),
    'On Progress': props<{ progress: number }>(),

    'Upload Videos': props<{ videos: IVideo[] }>(),
    'Upload Videos Success': emptyProps(),
    'Upload Videos Failure': props<{ error: string }>(),

    'Upload Photos': props<{ photos: IPhoto[] }>(),
    'Upload Photos Success': emptyProps(),
    'Upload Photos Failure': props<{ error: string }>(),

    'Cancel Upload': emptyProps(),
    'Silent Upload Cancellation': emptyProps(),
    'Cancel Upload Success': emptyProps(),
  },
});

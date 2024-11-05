import { IUpload, IVideo } from '@ever-co/shared-utils';
import { createActionGroup, emptyProps, props } from '@ngrx/store';

export const uploadActions = createActionGroup({
  source: 'Upload',
  events: {
    'In Progress': props<{ config: IUpload }>(),
    'On Progress': props<{ progress: number }>(),

    'Upload Video': props<{ videos: IVideo[] }>(),
    'Upload Video Success': emptyProps(),
    'Upload Video Failure': props<{ error: string }>(),

    'Cancel Upload': emptyProps(),
    'Cancel Upload Success': emptyProps(),
  }
});

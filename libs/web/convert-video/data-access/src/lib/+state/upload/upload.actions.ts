import { IUpload } from '@ever-co/shared-utils';
import { createActionGroup, emptyProps, props } from '@ngrx/store';

export const uploadActions = createActionGroup({
  source: 'Upload',
  events: {
    'In Progress': emptyProps(),
    'On Progress': props<{ progress: number }>(),

    'Upload Video': props<{ config: IUpload }>(),
    'Upload Video Success': emptyProps(),
    'Upload Video Failure': props<{ error: string }>(),

    'Cancel Upload': emptyProps(),
    'Cancel Upload Success': emptyProps(),
  }
});

import { createActionGroup, emptyProps, props } from '@ngrx/store';

export const uploadActions = createActionGroup({
  source: 'Upload',
  events: {
    'Upload Video': props<{ file: File }>(),
    'Upload Video Success': emptyProps(),
    'Upload Video Failure': props<{ error: string }>(),
  }
});

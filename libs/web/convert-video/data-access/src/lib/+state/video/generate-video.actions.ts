import { createActionGroup, emptyProps, props } from '@ngrx/store';
import { IVideo, IVideoConvertPayload } from '@prototype/shared/utils';

export const generateVideoActions = createActionGroup({
  source: 'GenerateVideo',
  events: {
    start: props<IVideoConvertPayload>(),
    'Start Success': emptyProps(),
    cancel: emptyProps(),
    'Cancel Success': emptyProps(),
    finish: props<{ video: IVideo }>(),
    progress: props<{ progress: number }>(),
    failure: props<{ error: string }>(),
    'Trigger Error': props<{ error: string }>(),
  },
});

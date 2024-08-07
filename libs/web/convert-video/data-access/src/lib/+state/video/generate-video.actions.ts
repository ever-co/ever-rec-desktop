import { IVideo, IVideoConvertPayload } from '@ever-capture/shared/utils';
import { createActionGroup, emptyProps, props } from '@ngrx/store';

export const generateVideoActions = createActionGroup({
  source: 'GenerateVideo',
  events: {
    start: props<IVideoConvertPayload>(),
    'Start Success': emptyProps(),
    cancel: emptyProps(),
    'Cancel Success': emptyProps(),
    finish: props<{ video: IVideo }>(),
    'Finish Success': emptyProps(),
    progress: props<{ progress: number }>(),
    failure: props<{ error: string }>(),
    'Trigger Error': props<{ error: string }>(),
    'Load Last Video': emptyProps(),
    'Load Last Video Success': props<{ video: IVideo | null }>(),
  },
});

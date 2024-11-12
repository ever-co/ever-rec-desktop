import {
  IVideo,
  IVideoConfig,
  IVideoConvertPayload,
} from '@ever-co/shared-utils';
import { createActionGroup, emptyProps, props } from '@ngrx/store';

export const generateVideoActions = createActionGroup({
  source: 'GenerateVideo',
  events: {
    'Auto Generate': props<{ config: IVideoConfig }>(),
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
    Reset: emptyProps(),
  },
});

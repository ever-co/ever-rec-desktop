import {
  IPaginationOptions,
  IPaginationResponse,
  IResizeEvent,
  ITimelineFrame,
} from '@ever-co/shared-utils';
import { createActionGroup, emptyProps, props } from '@ngrx/store';

export const timelineActions = createActionGroup({
  source: 'Timeline',
  events: {
    'Load Frames': props<IPaginationOptions<ITimelineFrame>>(),
    'Load Frames Success': props<IPaginationResponse<ITimelineFrame>>(),
    'Load Frames Failure': props<{ error: string }>(),

    'Seek To': props<{ currentTime: number }>(),
    'Toggle Playback': emptyProps(),
    'Update Current Time': props<{ currentTime: number }>(),

    'Resize Timeline': props<IResizeEvent>(),
    'Cursor Position': props<{ position: number }>(),
  },
});

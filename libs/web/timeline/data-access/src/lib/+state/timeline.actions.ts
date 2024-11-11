import {
  IPaginationOptions,
  IPaginationResponse,
  IResizeEvent,
  ITimelineFrame,
  IVideo,
} from '@ever-co/shared-utils';
import { createActionGroup, emptyProps, props } from '@ngrx/store';

export const timelineActions = createActionGroup({
  source: 'Timeline',
  events: {
    'Load Last Video': props<{ video: IVideo | null }>(),

    'Load Frames': props<IPaginationOptions<ITimelineFrame>>(),
    'Load Frames Success': props<IPaginationResponse<ITimelineFrame>>(),
    'Load Frames Failure': props<{ error: string }>(),

    'Select Frame': props<{ frame: ITimelineFrame | null }>(),

    'Seek To': props<{ currentTime: number }>(),
    'Toggle Playback': props<{ isPlaying: boolean }>(),
    'Update Current Time': props<{ currentTime: number }>(),

    'Resize Timeline': props<IResizeEvent>(),
    'Cursor Position': props<{ position: number }>(),
  },
});

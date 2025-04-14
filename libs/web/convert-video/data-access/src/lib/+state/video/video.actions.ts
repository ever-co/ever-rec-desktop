import {
  IFindOneOptions,
  IPaginationOptions,
  IPaginationResponse,
  ISelected,
  IVideo,
} from '@ever-co/shared-utils';
import { createActionGroup, emptyProps, props } from '@ngrx/store';

export const videoActions = createActionGroup({
  source: 'Video',
  events: {
    'Load Video': props<IFindOneOptions<IVideo>>(),
    'Load Video Success': props<{ video: IVideo }>(),
    'Load Video Failure': props<{ error: string }>(),

    'Load Videos': props<IPaginationOptions<IVideo>>(),
    'Load Videos Success': props<IPaginationResponse<IVideo>>(),
    'Load Videos Failure': props<{ error: string }>(),

    'Delete Videos': props<{ videos: IVideo[] }>(),
    'Delete Videos Success': props<{ videos: IVideo[] }>(),

    'Delete Video': props<IVideo>(),
    'Delete Video Success': props<{ id: string }>(),
    'Delete Video Failure': props<{ error: string }>(),

    'Update Video': props<Partial<IVideo>>(),
    'Update Video Success': props<IVideo>(),
    'Update Video Failure': props<{ error: string }>(),

    'Unselect All Videos': emptyProps(),
    'Unselect Video': props<{ video: ISelected<IVideo> }>(),
    'Select Video': props<{ video: ISelected<IVideo> }>(),

    'Reset Videos': emptyProps(),
  },
});

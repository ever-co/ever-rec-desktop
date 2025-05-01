import {
  IAudio,
  IFindOneOptions,
  IPaginationOptions,
  IPaginationResponse,
  ISelected,
} from '@ever-co/shared-utils';
import { createActionGroup, emptyProps, props } from '@ngrx/store';

export const audioActions = createActionGroup({
  source: 'AudioCrud',
  events: {
    'Load Audios': props<IPaginationOptions<IAudio>>(),
    'Load Audios Success': props<IPaginationResponse<IAudio>>(),
    'Load Audios Failure': props<{ error: string }>(),

    'Load Audio': props<IFindOneOptions<IAudio>>(),
    'Load Audio Success': props<{ audio: IAudio }>(),
    'Load Audio Failure': props<{ error: string }>(),

    'Delete Audio': props<IAudio>(),
    'Delete Audio Success': props<{ id: string }>(),
    'Delete Audio Failure': props<{ error: string }>(),

    'Delete Selected Audios': props<{ audios: IAudio[] }>(),
    'Delete Selected Audios Success': props<{ audios: IAudio[] }>(),
    'Delete Selected Audios Failure': props<{ error: string }>(),

    'Delete Audios': emptyProps(),
    'Delete Audios Success': emptyProps(),
    'Delete Audios Failure': props<{ error: string }>(),

    'Reset Audios': emptyProps(),
    'Unselect All Audios': emptyProps(),
    'Unselect Audio': props<{ audio: ISelected<IAudio> }>(),

    'Select Audio': props<{ audio: ISelected<IAudio> }>(),
  },
});

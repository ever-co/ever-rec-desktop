import {
  IAudio,
  IFindOneOptions,
  IPaginationOptions,
  IPaginationResponse,
  ISelected,
  IAudioSave,
} from '@ever-co/shared-utils';
import { createActionGroup, emptyProps, props } from '@ngrx/store';

export const audioActions = createActionGroup({
  source: 'Audio',
  events: {
    'Load Audios': props<IPaginationOptions<IAudio>>(),
    'Load Audios Success': props<IPaginationResponse<IAudio>>(),
    'Load Audios Failure': props<{ error: string }>(),

    'Load Audio': props<IFindOneOptions<IAudio>>(),
    'Load Audio Success': props<{ audio: IAudio }>(),
    'Load Audio Failure': props<{ error: string }>(),

    'Save Audio': props<IAudioSave>(),
    'Save Audio Success': props<{ audio: IAudio }>(),
    'Save Audio Failure': props<{ error: string }>(),

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

    'Start Recording': props<{ stream: MediaStream | null }>(),
    'Start Recording Success': props<{ stream: MediaStream | null }>(),
    'Start Recording Failure': props<{ error: string }>(),

    'Stop Recording': props<{ delayed?: boolean }>(),
    'Stop Recording Success': emptyProps(),
    'Stop Recording Failure': props<{ error: string }>(),

    'Select Audio': props<{ audio: ISelected<IAudio> }>(),
  },
});

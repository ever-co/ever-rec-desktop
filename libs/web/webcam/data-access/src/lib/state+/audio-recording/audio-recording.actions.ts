import {
  IAudio,
  IAudioSave,
} from '@ever-co/shared-utils';
import { createActionGroup, emptyProps, props } from '@ngrx/store';

export const audioRecordingActions = createActionGroup({
  source: 'AudioRecording',
  events: {
    'Save Audio': props<IAudioSave>(),
    'Save Audio Success': props<{ audio: IAudio }>(),
    'Save Audio Failure': props<{ error: string }>(),

    'Start Recording': props<{ stream: MediaStream | null }>(),
    'Start Recording Success': props<{ stream: MediaStream | null }>(),
    'Start Recording Failure': props<{ error: string }>(),

    'Stop Recording': props<{ delayed?: boolean }>(),
    'Stop Recording Success': emptyProps(),
    'Stop Recording Failure': props<{ error: string }>(),

    'Minimize Recording Screen': emptyProps(),
  },
});

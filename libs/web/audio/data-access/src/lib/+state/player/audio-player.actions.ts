import { IAudio } from '@ever-co/shared-utils';
import { createActionGroup, emptyProps, props } from '@ngrx/store';

export const audioPlayerActions = createActionGroup({
  source: 'AudioPlayer',
  events: {
    'Play Audio': props<{ audio: IAudio }>(),
    'Pause Audio': emptyProps(),
    'Toggle Play Pause': props<{ audio: IAudio }>(),
    'Seek Audio': props<{ time: number }>(),
    'Update Volume': props<{ volume: number }>(),
    'Toggle Mute': props<{ isMuted: boolean }>(),
    'Skip Forward': emptyProps(),
    'Skip Backward': emptyProps(),
    'Select Audio': props<{ audio: IAudio }>(),
    'Synchronize Audio': props<{ audio: IAudio }>(),
    'Synchronize Audio Success': emptyProps(),
    'Synchronize Audio Failure': props<{ error: string }>(),
    'Update Audio State': props<{
      currentTime: number;
      duration: number;
      isPlaying: boolean;
      volume: number;
      isMuted: boolean;
    }>(),
  },
});

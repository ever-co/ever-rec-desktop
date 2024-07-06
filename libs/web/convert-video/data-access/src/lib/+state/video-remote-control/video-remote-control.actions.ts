import { createActionGroup, props } from '@ngrx/store';

export const videoRemoteControlActions = createActionGroup({
  source: 'VideoRemoteControl',
  events: {
    'Set Scroll Percentage': props<{ percentage: number }>(),
    'Set Video Time': props<{ currentTime: number }>(),
  },
});

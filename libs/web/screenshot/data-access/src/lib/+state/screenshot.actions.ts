import { createActionGroup, emptyProps, props } from '@ngrx/store';

export const screenshotActions = createActionGroup({
  source: 'Screenshot',
  events: {
    'Start Capture': props<{ delay: number }>(),
    'Stop Capture': emptyProps(),
    'Capture Success': props<{ image: string }>(),
    'Capture Failure': props<{ error: string }>(),
  },
});

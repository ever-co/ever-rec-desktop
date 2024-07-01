import { createActionGroup, emptyProps, props } from '@ngrx/store';

export const screenshotActions = createActionGroup({
  source: 'Screenshot',
  events: {
    'Start Capture': props<{ delay: number }>(),
    'Start Capture Success': emptyProps(),
    'Stop Capture': emptyProps(),
    'Stop Capture Success': emptyProps(),
    'Capture Success': props<{ image: string }>(),
    'Capture Failure': props<{ error: string }>(),
  },
});

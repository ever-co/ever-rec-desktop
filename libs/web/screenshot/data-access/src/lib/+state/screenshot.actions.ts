import { createActionGroup, emptyProps, props } from '@ngrx/store';
import { IScreenshot } from '@prototype/shared/utils';

export const screenshotActions = createActionGroup({
  source: 'Screenshot',
  events: {
    'Start Capture': props<{ delay: number }>(),
    'Start Capture Success': emptyProps(),
    'Stop Capture': emptyProps(),
    'Stop Capture Success': emptyProps(),
    'Capture Success': props<{ screenshot: IScreenshot }>(),
    'Capture Failure': props<{ error: string }>(),
    'Load Screenshots': emptyProps(),
    'Load Screenshots Success': props<{ screenshots: IScreenshot[] }>(),
    'Load Screenshots Failure': props<{ error: string }>(),

    'Delete Screenshots': emptyProps(),
    'Delete Screenshots Success': emptyProps(),
    'Delete Screenshots Failure': props<{ error: string }>(),

    ask: props<{ request: string }>(),
    'ask Success': props<{ screenshots: IScreenshot[] }>(),
    'ask Failure': props<{ error: string }>(),
  },
});

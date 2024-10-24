import {
  IPaginationOptions,
  IPaginationResponse,
  IScreenCaptureConfig,
  IScreenshot,
  IScreenshotMetadataStatistic
} from '@ever-co/shared-utils';
import { createActionGroup, emptyProps, props } from '@ngrx/store';

export const screenshotActions = createActionGroup({
  source: 'Screenshot',
  events: {
    'Start Capture': props<IScreenCaptureConfig>(),
    'Start Capture Success': emptyProps(),

    'Stop Capture': emptyProps(),
    'Stop Capture Success': emptyProps(),

    'Capture Success': props<{ screenshot: IScreenshot }>(),
    'Capture Failure': props<{ error: string }>(),
    'Load Screenshots': props<IPaginationOptions>(),
    'Load Screenshots Success': props<IPaginationResponse<IScreenshot>>(),
    'Load Screenshots Failure': props<{ error: string }>(),

    'Delete Screenshot': props<IScreenshot>(),
    'Delete Screenshot Success': props<{ id: string }>(),
    'Delete Screenshot Failure': props<{ error: string }>(),

    'Delete Screenshots': emptyProps(),
    'Delete Screenshots Success': emptyProps(),
    'Delete Screenshots Failure': props<{ error: string }>(),

    'Get Screenshots Statistics': props<IPaginationOptions>(),
    'Get Screenshots Statistics Success': props<IPaginationResponse<IScreenshotMetadataStatistic>>(),
    'Get Screenshots Statistics Failure': props<{ error: string }>(),

    ask: props<IPaginationOptions>(),
    'ask Success': props<IPaginationResponse<IScreenshot>>(),
    'ask Failure': props<{ error: string }>(),
    'Reset Ask': emptyProps(),
  },
});

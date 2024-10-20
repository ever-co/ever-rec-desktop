import { IScreenCaptureConfig } from '@ever-co/shared-utils';
import { createActionGroup, emptyProps, props } from '@ngrx/store';

export const settingScreenCaptureActions = createActionGroup({
  source: 'SettingScreenCapture',
  events: {
    Load: emptyProps(),
    'Load Success': props<{ screenCaptureConfig: IScreenCaptureConfig| null }>(),
    Update: props<{ screenCaptureConfig: IScreenCaptureConfig}>(),
    Failure: props<{ error: string }>(),
  },
});

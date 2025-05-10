import { IVideoConfig } from '@ever-co/shared-utils';
import { createActionGroup, emptyProps, props } from '@ngrx/store';

export const generateVideoSettingActions = createActionGroup({
  source: 'GenerateVideoSetting',
  events: {
    Load: emptyProps(),
    'Load Success': props<{ videoConfig: IVideoConfig | null }>(),
    Update: props<{ videoConfig: IVideoConfig }>(),
    Failure: props<{ error: string }>(),
  },
});
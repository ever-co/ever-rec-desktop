import { IVideoConfig } from '@ever-capture/shared/utils';
import { createActionGroup, emptyProps, props } from '@ngrx/store';

export const settingActions = createActionGroup({
  source: 'Setting',
  events: {
    Load: emptyProps(),
    'Load Success': props<{ videoConfig: IVideoConfig | null }>(),
    Update: props<{ videoConfig: IVideoConfig }>(),
    Failure: props<{ error: string }>(),
  },
});

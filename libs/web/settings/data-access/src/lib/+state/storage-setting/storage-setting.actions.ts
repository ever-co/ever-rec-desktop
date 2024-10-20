import { createActionGroup, emptyProps, props } from '@ngrx/store';

export const settingStorageActions = createActionGroup({
  source: 'SettingStorage',
  events: {
    Load: emptyProps(),
    'Load Success': props<{ retention: number | null }>(),
    Update: props<{ retention: number}>(),
    Failure: props<{ error: string }>(),
  },
});

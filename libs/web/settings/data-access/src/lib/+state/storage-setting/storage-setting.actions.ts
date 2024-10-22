import { createActionGroup, emptyProps, props } from '@ngrx/store';
import { IStorageState } from './storage-setting.reducer';

export const settingStorageActions = createActionGroup({
  source: 'SettingStorage',
  events: {
    Load: emptyProps(),
    'Load Success': props<IStorageState | null>(),
    Update: props<Partial<IStorageState>>(),
    Failure: props<{ error: string }>()
  },
});

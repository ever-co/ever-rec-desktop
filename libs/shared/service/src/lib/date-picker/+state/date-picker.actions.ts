import { IRange } from '@ever-co/shared-utils';
import { createActionGroup, props } from '@ngrx/store';

export const datePickerActions = createActionGroup({
  source: 'DatePicker',
  events: {
    'Select Range': props<Partial<IRange>>(),
  }
});

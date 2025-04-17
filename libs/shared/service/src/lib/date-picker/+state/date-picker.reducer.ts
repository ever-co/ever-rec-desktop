import { currentWeekTillNow, IRange } from '@ever-co/shared-utils';
import { createFeature, createReducer, on } from '@ngrx/store';
import { datePickerActions } from './date-picker.actions';

export const datePickerFeatureKey = 'datePicker';

export interface State {
  selectedRange: IRange;
}

export const initialState: State = {
  selectedRange: currentWeekTillNow(),
};

export const reducer = createReducer(
  initialState,
  on(datePickerActions.selectRange, (state, range) => ({
    ...state,
    selectedRange: {
      ...state.selectedRange,
      ...range,
    },
  }))
);

export const datePickerFeature = createFeature({
  name: datePickerFeatureKey,
  reducer,
});

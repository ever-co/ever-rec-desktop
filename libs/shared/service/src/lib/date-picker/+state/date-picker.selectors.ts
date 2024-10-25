import { createFeatureSelector } from '@ngrx/store';
import * as fromDatePicker from './date-picker.reducer';

export const selectDatePickerState = createFeatureSelector<fromDatePicker.State>(
  fromDatePicker.datePickerFeatureKey
);

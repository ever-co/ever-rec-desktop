import { EnvironmentProviders, makeEnvironmentProviders } from '@angular/core';
import { provideState } from '@ngrx/store';
import { datePickerFeature } from './+state/date-picker.reducer';

export function provideDatePickerDataAccess(): EnvironmentProviders {
  return makeEnvironmentProviders([provideState(datePickerFeature)]);
}

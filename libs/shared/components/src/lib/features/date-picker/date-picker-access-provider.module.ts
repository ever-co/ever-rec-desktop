import { EnvironmentProviders, makeEnvironmentProviders } from '@angular/core';
import { provideEffects } from '@ngrx/effects';
import { provideState } from '@ngrx/store';
import { DatePickerEffects } from './+state/date-picker.effects';
import { datePickerFeature } from './+state/date-picker.reducer';


export function provideDatePickerDataAccess(): EnvironmentProviders {
  return makeEnvironmentProviders([
    provideState(datePickerFeature),
    provideEffects(DatePickerEffects),
  ]);
}

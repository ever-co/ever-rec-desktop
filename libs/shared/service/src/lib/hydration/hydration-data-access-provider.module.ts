import { EnvironmentProviders, makeEnvironmentProviders } from '@angular/core';
import { provideEffects } from '@ngrx/effects';
import { META_REDUCERS, provideState } from '@ngrx/store';
import { HydrationEffects } from './state+/hydration.effects';
import {
  hydrationFeature,
  hydrationMetaReducer,
} from './state+/hydration.reducer';

export function provideHydrationDataAccess(): EnvironmentProviders {
  return makeEnvironmentProviders([
    provideState(hydrationFeature),
    {
      provide: META_REDUCERS,
      useValue: hydrationMetaReducer,
      multi: true,
    },
    provideEffects(HydrationEffects),
  ]);
}

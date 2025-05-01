import { EnvironmentProviders, makeEnvironmentProviders } from '@angular/core';
import { provideEffects } from '@ngrx/effects';
import { META_REDUCERS } from '@ngrx/store';
import { HydrationEffects } from './state+/hydration.effects';
import { hydrationMetaReducer } from './state+/hydration.reducer';

export function provideHydrationDataAccess(): EnvironmentProviders {
  return makeEnvironmentProviders([
    {
      provide: META_REDUCERS,
      useValue: hydrationMetaReducer,
      multi: true,
    },
    provideEffects(HydrationEffects),
  ]);
}

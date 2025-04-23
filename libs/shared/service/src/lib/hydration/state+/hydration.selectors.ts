import { createFeatureSelector } from '@ngrx/store';
import * as fromHydration from './hydration.reducer';

export const selectHydrationState =
  createFeatureSelector<fromHydration.IHydationState>(
    fromHydration.hydrationFeatureKey
  );

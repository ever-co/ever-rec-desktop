import {
  Action,
  ActionReducer,
  createFeature,
  createReducer,
  on,
} from '@ngrx/store';
import { AppStateSchema } from '../state-hydration.service';
import { hydrationActions } from './hydration.actions';
import { mergeWithPriorityForEmpty } from '@ever-co/shared-utils';

export const hydrationFeatureKey = 'hydration';

export interface IHydationState {
  schemas: AppStateSchema[];
}

export const initialHydrationState: IHydationState = {
  schemas: [],
};

export const reducer = createReducer(
  initialHydrationState,
  on(hydrationActions.hydrateStateSuccess, (state, { schemas }) => ({
    ...state,
    schemas,
  }))
);

function isHydrateSuccess(
  action: Action
): action is ReturnType<typeof hydrationActions.hydrateStateSuccess> {
  return action.type === hydrationActions.hydrateStateSuccess.type;
}

export const hydrationMetaReducer = (
  reducer: ActionReducer<any>
): ActionReducer<any> => {
  return (state, action) => {
    if (isHydrateSuccess(action)) {
      return Object.assign({}, action.schemas, state);
    } else {
      return reducer(state, action);
    }
  };
};

export const hydrationFeature = createFeature({
  name: hydrationFeatureKey,
  reducer,
});

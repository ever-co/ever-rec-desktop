import { Action, ActionReducer } from '@ngrx/store';
import { hydrationActions } from './hydration.actions';

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
      return {
        ...state,
        ...action.schema.state,
      };
    } else {
      return reducer(state, action);
    }
  };
};

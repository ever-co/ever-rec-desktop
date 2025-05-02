import { createActionGroup, emptyProps, props } from '@ngrx/store';
import { AppStateSchema } from '../state-hydration.service';

export const hydrationActions = createActionGroup({
  source: 'Hydration',
  events: {
    'Hydrate State': emptyProps(),
    'Hydrate State Success': props<{ schema: AppStateSchema }>(),
    'Hydrate State Failure': emptyProps(),
  },
});

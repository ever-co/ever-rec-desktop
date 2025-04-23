import { createActionGroup, emptyProps, props } from '@ngrx/store';
import { AppStateSchema } from '../state-hydration.service';

export const hydrationActions = createActionGroup({
  source: 'Hydration',
  events: {
    'Hydrate State': emptyProps(),
    'Hydrate State Success': props<{ schemas: AppStateSchema[] }>(),
    'Hydrate State Failure': emptyProps(),
  },
});

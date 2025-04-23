import { Injectable } from '@angular/core';
import { Actions, createEffect, ofType } from '@ngrx/effects';
import { Store } from '@ngrx/store';
import { EMPTY } from 'rxjs';
import { concatMap, filter, map, switchMap, tap } from 'rxjs/operators';
import { StateHydrationService } from '../state-hydration.service';
import { hydrationActions } from './hydration.actions';

@Injectable()
export class HydrationEffects {
  // Save state changes to IndexedDB
  saveState$ = createEffect(
    () =>
      this.actions$.pipe(
        // Exclude hydration actions to avoid loops
        filter(
          (action) =>
            hydrationActions.hydrateState.type !== action.type &&
            hydrationActions.hydrateStateSuccess.type !== action.type
        ),
        // Save specific slices of state
        concatMap((action) => this.stateHydrationService.hydrate(action)),
        map(() => EMPTY)
      ),
    { dispatch: false }
  );

  // Load state from IndexedDB on hydrate action
  loadState$ = createEffect(
    () =>
      this.actions$.pipe(
        ofType(hydrationActions.hydrateState),
        switchMap(() =>
          this.stateHydrationService.reHydrate().pipe(
            tap((schemas) =>
              this.store.dispatch(
                hydrationActions.hydrateStateSuccess({ schemas })
              )
            ),
            map(() => EMPTY)
          )
        )
      ),
    { dispatch: false }
  );

  constructor(
    private store: Store,
    private actions$: Actions,
    private stateHydrationService: StateHydrationService
  ) {}
}

import { inject, Injectable } from '@angular/core';
import { Actions, createEffect, ofType } from '@ngrx/effects';
import { Store } from '@ngrx/store';
import { EMPTY } from 'rxjs';
import {
  concatMap,
  distinctUntilChanged,
  filter,
  map,
  switchMap,
  tap,
  withLatestFrom,
} from 'rxjs/operators';
import { StateHydrationService } from '../state-hydration.service';
import { hydrationActions } from './hydration.actions';
import { selectHydrationAppState } from './hydration.selectors';

@Injectable()
export class HydrationEffects {
  private store = inject(Store);
  private actions$ = inject(Actions);
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
        withLatestFrom(this.store.select(selectHydrationAppState)),
        map(([_, state]) => state),
        distinctUntilChanged(),
        concatMap((state) => this.stateHydrationService.hydrate(state)),
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
            tap((schema) =>
              this.store.dispatch(
                hydrationActions.hydrateStateSuccess({ schema })
              )
            ),
            map(() => EMPTY)
          )
        )
      ),
    { dispatch: false }
  );

  constructor(private stateHydrationService: StateHydrationService) {}
}

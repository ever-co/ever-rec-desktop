import { Injectable } from '@angular/core';
import { Actions, createEffect, ofType } from '@ngrx/effects';

import { EMPTY, Observable } from 'rxjs';
import { concatMap } from 'rxjs/operators';
import { datePickerActions } from './date-picker.actions';

@Injectable()
export class DatePickerEffects {


  loadDatePickers$ = createEffect(() => {
    return this.actions$.pipe(

      ofType(datePickerActions.selectRange),
      /** An EMPTY observable only emits completion. Replace with your own observable API request */
      concatMap(() => EMPTY as Observable<{ type: string }>)
    );
  });

  constructor(private actions$: Actions) {}
}

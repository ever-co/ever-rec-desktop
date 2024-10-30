import { Injectable } from '@angular/core';
import { Actions, createEffect, ofType } from '@ngrx/effects';

import { EMPTY, Observable } from 'rxjs';
import { concatMap } from 'rxjs/operators';
import { DatePickerService } from '../date-picker.service';
import { datePickerActions } from './date-picker.actions';

@Injectable()
export class DatePickerEffects {
  loadDatePickers$ = createEffect(() => {
    return this.actions$.pipe(
      ofType(datePickerActions.selectRange),
      concatMap((range) => {
        this.datePickerService.range.set({
          ...this.datePickerService.range(),
          ...range,
        });
        return EMPTY as Observable<{ type: string }>;
      })
    );
  });

  constructor(
    private actions$: Actions,
    private datePickerService: DatePickerService
  ) {}
}

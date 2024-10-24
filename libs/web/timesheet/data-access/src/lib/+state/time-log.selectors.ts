import { createFeatureSelector } from '@ngrx/store';
import * as fromTimeLog from './time-log.reducer';

export const selectTimeLogState = createFeatureSelector<fromTimeLog.State>(
  fromTimeLog.timeLogFeatureKey
);

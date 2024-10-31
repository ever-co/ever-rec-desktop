import { createFeature, createReducer, on } from '@ngrx/store';
import { TimelineActions } from './timeline.actions';

export const timelineFeatureKey = 'timeline';


export const initialState: State = {

};

export const reducer = createReducer(
  initialState,
  on(TimelineActions.timelineTimelines, state => state),

);

export const timelineFeature = createFeature({
  name: timelineFeatureKey,
  reducer,
});


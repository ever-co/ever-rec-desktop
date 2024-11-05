import { createFeature, createReducer, on } from '@ngrx/store';
import { uploadActions } from './upload.actions';

export const uploadFeatureKey = 'upload';

export interface State {

}

export const initialState: State = {

};

export const reducer = createReducer(
  initialState,
  on(uploadActions.loadUploads, state => state),

);

export const uploadFeature = createFeature({
  name: uploadFeatureKey,
  reducer,
});


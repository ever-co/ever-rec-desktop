import { createFeature, createReducer, on } from '@ngrx/store';
import { generateVideoActions } from './generate-video.actions';

export const generateVideoFeatureKey = 'generateVideo';

export interface State {
  progress: number;
  generating: boolean;
  error: string;
  videoPathname: string;
}

export const initialState: State = {
  progress: 0,
  generating: false,
  videoPathname: '',
  error: '',
};

export const reducer = createReducer(
  initialState,
  on(generateVideoActions.start, (state) => ({
    ...state,
    generating: true,
  })),
  on(generateVideoActions.cancel, (state) => ({
    ...state,
    generating: false,
  })),
  on(generateVideoActions.finish, (state, {videoPathname}) => ({
    ...state,
    videoPathname,
    generating: false,
  })),
  on(generateVideoActions.failure, (state, { error }) => ({
    ...state,
    error,
    generating: false,
  })),

  on(generateVideoActions.progress, (state, { progress }) => ({
    ...state,
    progress,
  }))
);

export const generateVideoFeature = createFeature({
  name: generateVideoFeatureKey,
  reducer,
});

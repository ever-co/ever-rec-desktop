import {
  IScreenCaptureConfig,
  Source
} from '@ever-co/shared-utils';
import { createFeature, createReducer, on } from '@ngrx/store';
import { settingScreenCaptureActions } from './setting.actions';

export const settingScreenCaptureFeatureKey = 'settingScreenCapture';

export interface State {
  screenCaptureConfig: IScreenCaptureConfig;
  error: string;
}

const initialState: State = {
  screenCaptureConfig: {
    period: 2,
    source: Source.WINDOWS,
    retention: 7,
  },
  error: '',
};

export const reducer = createReducer(
  initialState,
  on(settingScreenCaptureActions.load, (state) => ({ ...state, error: '' })),
  on(settingScreenCaptureActions.loadSuccess, (state, { screenCaptureConfig }) => ({
    ...state,
    screenCaptureConfig: screenCaptureConfig ?? state.screenCaptureConfig,
  })),
  on(settingScreenCaptureActions.failure, (state, { error }) => ({
    ...state,
    error,
  }))
);

export const settingScreenCaptureFeature = createFeature({
  name: settingScreenCaptureFeatureKey,
  reducer,
});

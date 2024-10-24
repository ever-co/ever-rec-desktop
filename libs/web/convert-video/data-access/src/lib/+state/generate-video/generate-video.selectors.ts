import { createFeatureSelector } from '@ngrx/store';
import * as fromGenerateVideo from './generate-video.reducer';

export const selectGenerateVideoState = createFeatureSelector<fromGenerateVideo.State>(
  fromGenerateVideo.generateVideoFeatureKey
);

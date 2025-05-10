import { createFeatureSelector } from '@ngrx/store';
import * as fromGenerateVideo from './generate-video.reducer';

export const selectGenerateVideoState =
  createFeatureSelector<fromGenerateVideo.GenerateVideoState>(
    fromGenerateVideo.generateVideoFeatureKey,
  );

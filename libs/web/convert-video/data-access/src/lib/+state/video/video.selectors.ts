import { createFeatureSelector } from '@ngrx/store';
import * as fromVideo from './video.reducer';

export const selectVideoState = createFeatureSelector<fromVideo.IVideoState>(
  fromVideo.videoFeatureKey
);

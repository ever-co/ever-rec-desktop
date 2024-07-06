import { createFeatureSelector } from '@ngrx/store';
import * as fromVideoRemoteControl from './video-remote-control.reducer';

export const selectVideoRemoteControlState =
  createFeatureSelector<fromVideoRemoteControl.IVideoRemoteControlState>(
    fromVideoRemoteControl.videoRemoteControlFeatureKey
  );

import * as fromVideoRemoteControl from './video-remote-control.reducer';
import { selectVideoRemoteControlState } from './video-remote-control.selectors';

describe('VideoRemoteControl Selectors', () => {
  it('should select the feature state', () => {
    const result = selectVideoRemoteControlState({
      [fromVideoRemoteControl.videoRemoteControlFeatureKey]: {}
    });

    expect(result).toEqual({});
  });
});

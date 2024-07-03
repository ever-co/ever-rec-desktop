import * as fromGenerateVideo from './generate-video.reducer';
import { selectGenerateVideoState } from './generate-video.selectors';

describe('GenerateVideo Selectors', () => {
  it('should select the feature state', () => {
    const result = selectGenerateVideoState({
      [fromGenerateVideo.generateVideoFeatureKey]: {}
    });

    expect(result).toEqual({});
  });
});

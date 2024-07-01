import * as fromScreenshot from './screenshot.reducer';
import { selectScreenshotState } from './screenshot.selectors';

describe('Screenshot Selectors', () => {
  it('should select the feature state', () => {
    const result = selectScreenshotState({
      [fromScreenshot.screenshotFeatureKey]: {}
    });

    expect(result).toEqual({});
  });
});

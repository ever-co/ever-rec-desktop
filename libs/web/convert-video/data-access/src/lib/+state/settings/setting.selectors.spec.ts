import * as fromSetting from './setting.reducer';
import { selectSettingState } from './setting.selectors';

describe('Setting Selectors', () => {
  it('should select the feature state', () => {
    const result = selectSettingState({
      [fromSetting.settingFeatureKey]: {}
    });

    expect(result).toEqual({});
  });
});

import * as fromBreadcrumb from './breadcrumb.reducer';
import { selectBreadcrumbState } from './breadcrumb.selectors';

describe('Breadcrumb Selectors', () => {
  it('should select the feature state', () => {
    const result = selectBreadcrumbState({
      [fromBreadcrumb.breadcrumbFeatureKey]: {}
    });

    expect(result).toEqual({});
  });
});

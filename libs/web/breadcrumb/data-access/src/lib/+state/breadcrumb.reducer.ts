import { createFeature, createReducer, on } from '@ngrx/store';
import { IBreadcrumb } from '../model/breadcrumb.model';
import { breadcrumbActions } from './breadcrumb.actions';

export const breadcrumbFeatureKey = 'breadcrumb';

export interface IBreadcrumbsState {
  breadcrumbs: IBreadcrumb[];
}

export const initialState: IBreadcrumbsState = {
  breadcrumbs: [],
};

export const reducer = createReducer(
  initialState,
  on(breadcrumbActions.add, (state, { breadcrumb }) => {
    return { ...state, breadcrumbs: [...state.breadcrumbs, breadcrumb] };
  }),
  on(breadcrumbActions.remove, (state) => {
    return { ...state, breadcrumbs: state.breadcrumbs.slice(0, -1)};
  }),
  on(breadcrumbActions.reset, () => initialState)
);

export const breadcrumbFeature = createFeature({
  name: breadcrumbFeatureKey,
  reducer,
});

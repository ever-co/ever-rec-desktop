import { createActionGroup, emptyProps, props } from '@ngrx/store';
import { IBreadcrumb } from '../model/breadcrumb.model';

export const breadcrumbActions = createActionGroup({
  source: 'Breadcrumb',
  events: {
    Add: props<{ breadcrumb: IBreadcrumb }>(),
    Set: props<{ breadcrumbs: IBreadcrumb[] }>(),
    Remove: emptyProps(),
    Reset: emptyProps(),
  },
});

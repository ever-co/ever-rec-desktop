import { IFindOneOptions, IFindOptionsWhere, IPaginationOptions, IPaginationResponse, ITimeLog, ITimeLogStatistics } from '@ever-co/shared-utils';
import { createActionGroup, props } from '@ngrx/store';

export const timeLogActions = createActionGroup({
  source: 'TimeLog',
  events: {
    'Load TimeLog': props<IFindOneOptions>(),
    'Load TimeLog Success': props<{ timeLog: ITimeLog }>(),
    'Load TimeLog Failure': props<{ error: string }>(),

    'Load TimeLogs': props<IPaginationOptions>(),
    'Load TimeLogs Success': props<IPaginationResponse<ITimeLog>>(),
    'Load TimeLogs Failure': props<{ error: string }>(),

    'Delete TimeLog': props<{timeLog: ITimeLog}>(),
    'Delete TimeLog Success': props<{id: string}>(),
    'Delete TimeLog Failure': props<{ error: string }>(),

    'Get TimeLog Statistics': props<IFindOptionsWhere<ITimeLog>>(),
    'Get TimeLog Statistics Success': props<ITimeLogStatistics>(),
    'Get TimeLog Statistics Failure': props<{ error: string }>(),

    'Update TimeLog Duration Success': props<IPaginationResponse<ITimeLog>>(),
  }
});

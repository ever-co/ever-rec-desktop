import { ITimeLog, ITimeLogStatistics } from '@ever-co/shared-utils';
import { createFeature, createReducer, on } from '@ngrx/store';
import { timeLogActions } from './time-log.actions';

export const timeLogFeatureKey = 'timeLog';

export interface State {
  error: string;
  timeLog: ITimeLog;
  timeLogs: ITimeLog[];
  hasNext: boolean;
  count: number;
  loading: boolean;
  statistics: ITimeLogStatistics;
}

export const initialState: State = {
  timeLog: {} as ITimeLog,
  timeLogs: [],
  error: '',
  count: 0,
  hasNext: false,
  loading: false,
  statistics: {
    month: 0,
    week: 0,
    today: 0,
    range: 0,
  },
};

export const reducer = createReducer(
  initialState,
  // Load Videos
  on(timeLogActions.loadTimeLogs, (state) => ({
    ...state,
    loading: true,
    error: '',
  })),
  on(timeLogActions.loadTimeLogsSuccess, (state, { data, hasNext, count }) => ({
    ...state,
    count,
    hasNext,
    timeLogs: [...data],
    loading: false,
    error: '',
  })),
  on(timeLogActions.loadTimeLogsFailure, (state, { error }) => ({
    ...state,
    loading: false,
    error,
  })),

  // Load Video
  on(timeLogActions.loadTimeLog, (state) => ({
    ...state,
    loading: true,
    error: '',
  })),
  on(timeLogActions.loadTimeLogSuccess, (state, { timeLog }) => ({
    ...state,
    timeLog,
    loading: false,
    error: '',
  })),
  on(timeLogActions.loadTimeLogFailure, (state, { error }) => ({
    ...state,
    loading: false,
    error,
  })),

  // Delete Video
  on(timeLogActions.deleteTimeLog, (state) => ({
    ...state,
    loading: true,
    error: '',
  })),

  on(timeLogActions.deleteTimeLogSuccess, (state, { id }) => ({
    ...state,
    timeLog: state.timeLog?.id === id ? initialState.timeLog : state.timeLog,
    timeLogs: state.timeLogs.filter((t) => t.id !== id),
  })),

  on(timeLogActions.deleteTimeLogFailure, (state, { error }) => ({
    ...state,
    loading: false,
    error,
  })),

  // Get Statistics
  on(timeLogActions.getTimeLogStatistics, (state) => ({
    ...state,
    loading: true,
  })),

  on(timeLogActions.getTimeLogStatisticsSuccess, (state, statistics) => ({
    ...state,
    statistics,
    loading: false,
    error: '',
  })),

  on(timeLogActions.getTimeLogStatisticsFailure, (state, { error }) => ({
    ...state,
    loading: false,
    error,
  })),

  on(timeLogActions.updateTimeLogDurationSuccess, (state, { data }) => {
    const dataMap = new Map(data.map(d => [d.id, d]));
    return {
      ...state,
      timeLogs: state.timeLogs.map(timeLog => dataMap.get(timeLog.id) || timeLog),
    };
  })
);

export const timeLogFeature = createFeature({
  name: timeLogFeatureKey,
  reducer,
});

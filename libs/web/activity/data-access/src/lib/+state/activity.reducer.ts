import {
  IActivityStateDistribution,
  IAggregatedProductivity,
  IDailyStatistics,
  IHourlyDistribution,
  IWorkPatternAnalysis,
} from '@ever-co/shared-utils';
import { createFeature, createReducer, on } from '@ngrx/store';
import { activityActions } from './activity.actions';

export const activityFeatureKey = 'activity';

export interface IActivityState {
  distribution: IActivityStateDistribution;
  analysis: IWorkPatternAnalysis;
  statistics: IDailyStatistics;
  trends: IAggregatedProductivity;
  hourlyDistribution: IHourlyDistribution;
  error: string;
  loading: boolean;
}

export const initialState: IActivityState = {
  distribution: {
    active: 0,
    idle: 0,
    locked: 0,
    unknown: 0,
  },
  analysis: {
    averageDailyHours: 0,
    consistencyScore: 0,
    mostProductiveDay: '',
    mostProductiveHours: [],
  },
  statistics: {
    activeDuration: 0,
    idleDuration: 0,
    productivity: 0,
    totalDuration: 0,
  },
  trends: {} as IAggregatedProductivity,
  hourlyDistribution: [],
  error: '',
  loading: false,
};

export const reducer = createReducer(
  initialState,
  on(
    activityActions.loadStateDistributionSuccess,
    (state, { distribution }) => ({
      ...state,
      distribution,
      loading: false,
    })
  ),
  on(activityActions.loadWorkPatternAnalysisSuccess, (state, { analysis }) => ({
    ...state,
    analysis,
    loading: false,
  })),
  on(activityActions.loadDailyStatisticsSuccess, (state, { statistics }) => ({
    ...state,
    statistics,
    loading: false,
  })),
  on(activityActions.loadProductivityTrendsSuccess, (state, { trends }) => ({
    ...state,
    trends,
    loading: false,
  })),
  on(
    activityActions.loadStateDistributionHourlySuccess,
    (state, { hourlyDistribution }) => ({
      ...state,
      hourlyDistribution,
      loading: false,
    })
  ),

  on(
    activityActions.loadStateDistributionFailure,
    activityActions.loadWorkPatternAnalysisFailure,
    activityActions.loadDailyStatisticsFailure,
    activityActions.loadProductivityTrendsFailure,
    activityActions.loadStateDistributionHourlyFailure,
    (state, { error }) => ({
      ...state,
      error,
      loading: false,
    })
  ),

  on(
    activityActions.loadStateDistribution,
    activityActions.loadWorkPatternAnalysis,
    activityActions.loadDailyStatistics,
    activityActions.loadProductivityTrends,
    activityActions.loadStateDistributionHourly,
    (state) => ({
      ...state,
      loading: true,
      error: ''
    })
  )
);

export const activityFeature = createFeature({
  name: activityFeatureKey,
  reducer,
});

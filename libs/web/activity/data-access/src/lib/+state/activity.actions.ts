import {
  IActivityStateDistribution,
  IAggregatedProductivity,
  IDailyStatistics,
  IHourlyDistribution,
  IRange,
  IWorkPatternAnalysis,
} from '@ever-co/shared-utils';
import { createActionGroup, props } from '@ngrx/store';

export const activityActions = createActionGroup({
  source: 'Activity',
  events: {
    // Distrution Action
    'Load state distribution': props<{ range: IRange }>(),
    'Load state distribution Success': props<{
      distribution: IActivityStateDistribution;
    }>(),
    'Load State Distribution Failure': props<{ error: string }>(),

    // Work Pattern Action
    'Load Work Pattern Analysis': props<{ range: IRange }>(),
    'Load Work Pattern Analysis Success': props<{
      analysis: IWorkPatternAnalysis;
    }>(),
    'Load Work Pattern Analysis Failure': props<{ error: string }>(),

    // Statistics
    'Load Daily Statistics': props<{ range: IRange }>(),
    'Load Daily Statistics Success': props<{
      statistics: IDailyStatistics;
    }>(),
    'Load Daily Statistics Failure': props<{ error: string }>(),

    // Trends
    'Load Productivity Trends': props<{
      range: IRange;
      interval: 'daily' | 'weekly' | 'monthly';
    }>(),
    'Load Productivity Trends Success': props<{
      trends: IAggregatedProductivity;
    }>(),
    'Load Productivity Trends Failure': props<{ error: string }>(),

    // Hourly
    'Load state distribution Hourly': props<{ date: Date }>(),
    'Load state distribution Hourly Success': props<{
      hourlyDistribution: IHourlyDistribution;
    }>(),
    'Load State Distribution Hourly Failure': props<{ error: string }>(),
  },
});

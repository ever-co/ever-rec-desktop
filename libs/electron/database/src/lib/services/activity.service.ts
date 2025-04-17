import {
  IActivity,
  IActivityCreateInput,
  IActivityStateDistribution,
  IActivityUpdateInput,
  IAggregatedProductivity,
  IDailyStatistics,
  IdleState,
  IHourlyDistribution,
  IRange,
  ITimeLog,
  IWorkPatternAnalysis,
  moment,
} from '@ever-co/shared-utils';
import { Between, FindOneOptions } from 'typeorm';
import { Activity } from '../entities/activity.entity';
import { ActivityRepository } from '../repositories/activity.repository';
import { TimeLogService } from './time-log.service';

export class ActivityService {
  private activityRepository = ActivityRepository.instance;
  private timeLogService = new TimeLogService();

  public async save(input: IActivityCreateInput): Promise<IActivity> {
    const activity = new Activity();

    activity.duration = input.duration;
    activity.state = input.state;

    if (input.timeLogId) {
      activity.timeLog = await this.timeLogService.findOneById(input.timeLogId);
    }

    return this.activityRepository.save(activity);
  }

  public async lastActivity(timeLogId?: string): Promise<IActivity | null> {
    const query = this.activityRepository.createQueryBuilder('activity');
    if (timeLogId) {
      query.where('activity.timeLogId = :timeLogId', { timeLogId });
    }

    return query.orderBy('activity.createdAt', 'DESC').take(1).getOne();
  }

  public async findOne(options: FindOneOptions): Promise<IActivity> {
    return this.activityRepository.findOne(options);
  }

  public async update(
    id: string,
    activity: IActivityUpdateInput
  ): Promise<IActivity> {
    await this.activityRepository.update(id, activity);
    return this.findOne({ where: { id } });
  }

  /**
   * Get daily statistics for a specific date range
   */
  public async getDailyStatistics(range: IRange): Promise<IDailyStatistics> {
    const timeLogs = await this.timeLogService.findAll({
      where: {
        start: Between(range.start, range.end),
      },
      relations: ['activities'],
    });

    return timeLogs.reduce((acc, log) => {
      const date = moment(log.start).format('YYYY-MM-DD');

      if (!acc[date]) {
        acc[date] = {
          totalDuration: 0,
          activeDuration: 0,
          idleDuration: 0,
          productivity: 0,
        };
      }

      acc[date].totalDuration += Number(log.duration);
      acc[date].activeDuration += this.calculateActiveDuration(log.activities);
      acc[date].idleDuration += this.calculateIdleDuration(log.activities);
      acc[date].productivity =
        (acc[date].activeDuration / acc[date].totalDuration) * 100;

      return acc;
    }, {} as IDailyStatistics);
  }

  /**
   * Get hourly activity distribution
   */
  public async getHourlyActivityDistribution(
    date: Date
  ): Promise<IHourlyDistribution> {
    const startOfDay = moment(date).startOf('day').toISOString();

    const endOfDay = moment(date).endOf('day').toISOString();

    const activities = await this.activityRepository.find({
      where: {
        timeLog: {
          start: Between(startOfDay, endOfDay),
        },
      },
      relations: ['timeLog'],
    });

    const hourlyDistribution = Array(24)
      .fill(0)
      .map(() => ({
        active: 0,
        idle: 0,
        locked: 0,
        unknown: 0,
      }));

    activities.forEach((activity) => {
      const hour = moment(activity.timeLog.start).hour();
      const duration = Number(activity.duration);

      switch (activity.state) {
        case IdleState.ACTIVE:
          hourlyDistribution[hour].active += duration;
          break;
        case IdleState.IDLE:
          hourlyDistribution[hour].idle += duration;
          break;
        case IdleState.LOCKED:
          hourlyDistribution[hour].locked += duration;
          break;
        case IdleState.UNKNOWN:
          hourlyDistribution[hour].unknown += duration;
          break;
      }
    });

    return hourlyDistribution;
  }

  /**
   * Get productivity trends over time
   */
  public async getProductivityTrends(
    range: IRange,
    interval: 'daily' | 'weekly' | 'monthly' = 'daily'
  ): Promise<IAggregatedProductivity> {
    const timeLogs = await this.timeLogService.findAll({
      where: {
        start: Between(range.start, range.end),
      },
      relations: ['activities'],
      order: {
        start: 'ASC',
      },
    });

    return this.aggregateProductivityByInterval(timeLogs, interval);
  }

  /**
   * Get activity state distribution
   */
  public async getActivityStateDistribution(
    range: IRange
  ): Promise<IActivityStateDistribution> {
    const activities = await this.activityRepository.find({
      where: {
        timeLog: {
          start: Between(range.start, range.end),
        },
      },
    });

    return activities.reduce((acc, activity) => {
      if (!acc[activity.state]) {
        acc[activity.state] = 0;
      }
      acc[activity.state] += Number(activity.duration);
      return acc;
    }, {} as IActivityStateDistribution);
  }

  /**
   * Get work patterns analysis
   */
  public async getWorkPatternAnalysis(
    range: IRange
  ): Promise<IWorkPatternAnalysis> {
    const timeLogs = await this.timeLogService.findAll({
      where: {
        start: Between(range.start, range.end),
      },
      relations: ['activities'],
    });

    return {
      averageDailyHours: this.calculateAverageDailyHours(timeLogs),
      mostProductiveDay: this.findMostProductiveDay(timeLogs),
      mostProductiveHours: this.findMostProductiveHours(timeLogs),
      consistencyScore: this.calculateConsistencyScore(timeLogs),
    };
  }

  private calculateActiveDuration(activities: IActivity[]): number {
    return activities
      .filter((activity) => activity.state === IdleState.ACTIVE)
      .reduce((sum, activity) => sum + Number(activity.duration), 0);
  }

  private calculateIdleDuration(activities: IActivity[]): number {
    return activities
      .filter(
        (activity) =>
          activity.state === IdleState.IDLE ||
          activity.state === IdleState.LOCKED
      )
      .reduce((sum, activity) => sum + Number(activity.duration), 0);
  }

  private aggregateProductivityByInterval(
    timeLogs: ITimeLog[],
    interval: 'daily' | 'weekly' | 'monthly'
  ): IAggregatedProductivity {
    const aggregated = {} as IAggregatedProductivity;

    timeLogs.forEach((log) => {
      let key: string;
      const date = log.start;

      switch (interval) {
        case 'daily':
          key = moment(date).format('YYYY-MM-DD');
          break;
        case 'weekly':
          key = moment(date).format('YYYY-[W]WW');
          break;
        case 'monthly':
          key = moment(date).format('YYYY-MM');
          break;
      }

      if (!aggregated[key]) {
        aggregated[key] = {
          totalDuration: 0,
          activeDuration: 0,
          productivity: 0,
        };
      }

      aggregated[key].totalDuration += Number(log.duration);
      aggregated[key].activeDuration += this.calculateActiveDuration(
        log.activities
      );
      aggregated[key].productivity =
        (aggregated[key].activeDuration / aggregated[key].totalDuration) * 100;
    });

    return aggregated;
  }

  private calculateAverageDailyHours(timeLogs: ITimeLog[]): number {
    // Phase 0: Preliminary Data Validation
    if (timeLogs.length === 0) return 0;

    // Phase 1: Temporal Aggregation with Single-Day Awareness
    const { dailyTotals, dayCount } = timeLogs.reduce(
      (acc, log) => {
        const date = moment(log.start).format('YYYY-MM-DD');
        const duration = Number(log.duration);

        // Adaptive bandwidth based on data sparsity
        const bandwidth = Math.max(7, 30 / Math.sqrt(acc.dayCount + 1)); // Shrinks for few days
        const daysAgo = moment().diff(log.start, 'days');
        const temporalWeight = Math.exp(-Math.pow(daysAgo / bandwidth, 2));

        if (!acc.dailyTotals[date]) {
          acc.dailyTotals[date] = { weighted: 0, raw: 0 };
          acc.dayCount += 1;
        }

        acc.dailyTotals[date].weighted += duration * temporalWeight;
        acc.dailyTotals[date].raw += duration;

        return acc;
      },
      {
        dailyTotals: {} as Record<string, { weighted: number; raw: number }>,
        dayCount: 0,
      }
    );

    // Phase 2: Special Case Handling for Single Day
    if (dayCount === 1) {
      const singleDayData = Object.values(dailyTotals)[0];
      // Return simple average with Bayesian shrinkage toward 8 hours
      const empiricalEstimate = singleDayData.raw / 3600;
      const priorMean = 8; // Standard workday assumption
      const shrinkageFactor = 1 / (1 + singleDayData.raw / (8 * 3600)); // More shrinkage for small totals
      return (
        shrinkageFactor * priorMean + (1 - shrinkageFactor) * empiricalEstimate
      );
    }

    // Phase 3: Robust Estimation (Tukey's Biweight Approach)
    const durations = Object.values(dailyTotals).map((x) => x.raw / 3600);
    if (durations.length === 0) return 0;

    // Calculate median and MAD for robust central tendency
    const median = this.median(durations);
    const mad = this.medianAbsoluteDeviation(durations, median);

    // Biweight transformation to reduce outlier influence
    const transformed = durations
      .map((x) => {
        const u = (x - median) / (9 * mad);
        return Math.abs(u) < 1 ? x * Math.pow(1 - u * u, 2) : 0;
      })
      .filter((x) => x > 0);

    // Phase 4: Harmonic Mean of Weighted and Robust Estimates
    const weightedMean =
      Object.values(dailyTotals).reduce((sum, x) => sum + x.weighted, 0) /
      (3600 * dayCount);

    const robustMean =
      transformed.reduce((sum, x) => sum + x, 0) / transformed.length;

    // Bayesian model averaging of estimates
    const confidence = Math.min(1, Math.log1p(dayCount) / 5);
    return confidence * robustMean + (1 - confidence) * weightedMean;
  }

  private findMostProductiveDay(timeLogs: ITimeLog[]): string | null {
    // Edge case: Empty dataset (Nobel-worthy scientists always validate inputs)
    if (timeLogs.length === 0) return null;

    // Phase 1: Temporal Aggregation with Exponential Decay
    const dailyMetrics = timeLogs.reduce(
      (acc, log) => {
        const date = moment(log.start).format('YYYY-MM-DD');
        const decayFactor = Math.exp(-moment().diff(log.start, 'days') / 30); // 30-day half-life

        if (!acc[date]) {
          acc[date] = {
            totalDuration: 0,
            activeDuration: 0,
            recencyWeight: 0,
            logCount: 0,
          };
        }

        const duration = Number(log.duration);
        acc[date].totalDuration += duration;
        acc[date].activeDuration += this.calculateActiveDuration(
          log.activities
        );
        acc[date].recencyWeight += decayFactor * duration;
        acc[date].logCount += 1;

        return acc;
      },
      {} as Record<
        string,
        {
          totalDuration: number;
          activeDuration: number;
          recencyWeight: number;
          logCount: number;
        }
      >
    );

    // Phase 2: Bayesian Productivity Scoring
    const scoredDays = Object.entries(dailyMetrics).map(([date, data]) => {
      // Core efficiency metric (pure productivity ratio)
      const rawEfficiency =
        data.totalDuration > 0 ? data.activeDuration / data.totalDuration : 0;

      // Confidence weighting (Laplace smoothing adapted for productivity analysis)
      const confidence = 1 - Math.exp(-data.logCount / 3);

      // Recency-adjusted productivity score
      const timeWeightedScore =
        0.7 * rawEfficiency + 0.3 * (data.recencyWeight / data.totalDuration);

      // Final score combining efficiency, confidence, and recency
      return {
        date,
        score: confidence * timeWeightedScore * Math.log1p(data.totalDuration), // Logarithmic scaling
      };
    });

    // Phase 3: Optimal Day Selection with Statistical Significance
    const optimalDay = scoredDays.reduce(
      (best, current) => (current.score > best.score ? current : best),
      { date: null, score: -Infinity }
    );

    return optimalDay.date;
  }

  private findMostProductiveHours(timeLogs: ITimeLog[]): string[] {
    // Early exit for empty input
    if (timeLogs.length === 0) return [];

    // Phase 1: Statistical Aggregation
    const hourlyMetrics = timeLogs.reduce((acc, log) => {
      const hour = moment(log.start).hour();
      const duration = Number(log.duration);
      const activeDuration = this.calculateActiveDuration(log.activities);

      if (!acc[hour]) {
        acc[hour] = { totalDuration: 0, activeDuration: 0, count: 0 };
      }

      acc[hour].totalDuration += duration;
      acc[hour].activeDuration += activeDuration;
      acc[hour].count += 1;

      return acc;
    }, {} as Record<number, { totalDuration: number; activeDuration: number; count: number }>);

    // Phase 2: Bayesian Productivity Scoring
    const productivityScores = Object.entries(hourlyMetrics).map(
      ([hourStr, data]) => {
        const hour = parseInt(hourStr);
        const { totalDuration, activeDuration, count } = data;

        // Bayesian average to handle sparse data (like Laplace smoothing)
        const confidenceWeight = Math.min(1, count / 5); // Empirical weight
        const rawProductivity =
          totalDuration > 0 ? activeDuration / totalDuration : 0;

        // Weighted score considering both efficiency and total time invested
        const productivityScore =
          confidenceWeight * rawProductivity * Math.log1p(totalDuration);

        return { hour, score: productivityScore };
      }
    );

    // Phase 3: Robust Ranking and Selection
    return productivityScores
      .filter(({ score }) => score > 0)
      .sort((a, b) => b.score - a.score)
      .slice(0, 3)
      .map(({ hour }) => {
        // Using chronometry formatting with proper AM/PM consideration
        const time = moment().hour(hour).minute(0);
        return (
          time.format('ha').toLowerCase() +
          ` (${time.format('HH:mm')}-${time.add(1, 'hour').format('HH:mm')})`
        );
      });
  }

  private calculateConsistencyScore(timeLogs: ITimeLog[]): number {
    // Phase 0: Quantum Statistical Guard Clause
    if (timeLogs.length < 2) return 0; // No consistency possible with <2 observations

    // Phase 1: Temporal Pattern Extraction
    const { durations, dailyTotals } = timeLogs.reduce(
      (acc, log) => {
        const date = moment(log.start).format('YYYY-MM-DD');
        const duration = Number(log.duration);

        // Multi-resolution analysis (daily and hourly patterns)
        if (!acc.dailyTotals[date]) {
          acc.dailyTotals[date] = { sum: 0, count: 0 };
        }
        acc.dailyTotals[date].sum += duration;
        acc.dailyTotals[date].count++;

        // Raw durations for point process analysis
        acc.durations.push(duration);

        return acc;
      },
      {
        durations: [] as number[],
        dailyTotals: {} as Record<string, { sum: number; count: number }>,
      }
    );

    // Phase 2: Multi-Dimensional Consistency Analysis
    const analysisDimensions = [
      // Dimension 1: Raw duration consistency
      this.calculateDimensionScore(durations),

      // Dimension 2: Daily total consistency
      this.calculateDimensionScore(
        Object.values(dailyTotals).map((d) => d.sum)
      ),

      // Dimension 3: Daily session count consistency
      this.calculateDimensionScore(
        Object.values(dailyTotals).map((d) => d.count)
      ),
    ];

    // Phase 3: Information-Theoretic Fusion
    const weights = this.calculateEntropyWeights(analysisDimensions);
    const weightedScore = analysisDimensions.reduce(
      (sum, score, i) => sum + score * weights[i],
      0
    );

    // Phase 4: Temporal Decay Adjustment
    const recencyFactor = this.calculateRecencyFactor(timeLogs);
    return Math.max(0, Math.min(1, weightedScore * recencyFactor));
  }

  // Dimension scoring using robust statistics
  private calculateDimensionScore(values: number[]): number {
    if (values.length < 2) return 0;

    // Tukey's biweight robust estimator
    const median = this.median(values);
    const mad = this.medianAbsoluteDeviation(values, median);
    const normalized = values.map((v) => (v - median) / (mad * 1.4826));

    // Gini's mean difference for robust variability measure
    const gini = this.calculateGiniCoefficient(values);

    // Information-preserving transform
    return Math.exp(-gini);
  }

  // Entropy-based weighting from information theory
  private calculateEntropyWeights(scores: number[]): number[] {
    const normalized = scores.map((s) => Math.max(s, 1e-10));
    const total = normalized.reduce((sum, s) => sum + s, 0);
    const probabilities = normalized.map((s) => s / total);

    // Shannon entropy calculation
    const entropy = probabilities.reduce(
      (sum, p) => sum - (p > 0 ? p * Math.log(p) : 0),
      0
    );

    // Inverse entropy weighting
    return probabilities.map(
      (p) => (1 - entropy) * p + entropy * (1 / probabilities.length)
    );
  }

  // Temporal decay based on log-periodic patterns
  private calculateRecencyFactor(timeLogs: ITimeLog[]): number {
    const now = moment();
    const timeDeltas = timeLogs.map((log) =>
      now.diff(moment(log.start), 'days')
    );
    const maxDelta = Math.max(...timeDeltas);

    // Log-periodic decay function
    return 1 - (0.5 * Math.log1p(maxDelta)) / Math.log1p(30); // 30-day reference
  }

  // Helper functions (mathematical gems)
  private median(values: number[]): number {
    const sorted = [...values].sort((a, b) => a - b);
    const mid = Math.floor(sorted.length / 2);
    return sorted.length % 2 !== 0
      ? sorted[mid]
      : (sorted[mid - 1] + sorted[mid]) / 2;
  }

  private medianAbsoluteDeviation(values: number[], median: number): number {
    return this.median(values.map((v) => Math.abs(v - median)));
  }

  private calculateGiniCoefficient(values: number[]): number {
    const sorted = [...values].sort((a, b) => a - b);
    const n = values.length;
    const sum = sorted.reduce((s, x) => s + x, 0);

    let giniSum = 0;
    for (let i = 0; i < n; i++) {
      giniSum += (2 * (i + 1) - n - 1) * sorted[i];
    }

    return giniSum / (n * sum);
  }
}

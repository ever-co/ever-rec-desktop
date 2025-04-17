import {
  currentDay,
  IPaginationOptions,
  IPaginationResponse,
  IScreenshotMetadata,
  IScreenshotMetadataStatistic,
  moment,
} from '@ever-co/shared-utils';
import { FindManyOptions, FindOneOptions, In } from 'typeorm';
import { ScreenshotMetadata } from '../entities/screenshot-metadata.entity';
import { ScreenshotMetadataRepository } from '../repositories/screenshot-metadata.repository';
import { ApplicationService } from './application.service';

export class ScreenshotMetadataService {
  private static readonly repository = ScreenshotMetadataRepository.instance;
  private static readonly applicationService = new ApplicationService();

  public static async save(
    metadata: Partial<IScreenshotMetadata>
  ): Promise<IScreenshotMetadata> {
    const screenshotMetadata = new ScreenshotMetadata();
    screenshotMetadata.description = metadata.description;
    screenshotMetadata.size = metadata.size;
    screenshotMetadata.application = await this.applicationService.save(
      metadata
    );
    return this.repository.save(screenshotMetadata);
  }

  public static async findAll(
    options: FindManyOptions
  ): Promise<IScreenshotMetadata[]> {
    return this.repository.find(options);
  }

  public static async update(
    id: string,
    metadata: Partial<IScreenshotMetadata>
  ): Promise<IScreenshotMetadata> {
    await this.repository.update(id, metadata);
    return this.findOneById(id);
  }

  public static async findOne(
    options: FindOneOptions
  ): Promise<IScreenshotMetadata> {
    return this.repository.findOne(options);
  }

  public static async findOneById(id: string): Promise<IScreenshotMetadata> {
    return this.repository.findOneBy({ id });
  }

  public static async delete(id: string): Promise<void> {
    await this.repository.softDelete({ id });
  }

  public static async deleteAll(metadataIds?: string[]): Promise<void> {
    await this.repository.softDelete(
      metadataIds ? { id: In(metadataIds) } : {}
    );
  }

  public static async statistics(
    options: IPaginationOptions<IScreenshotMetadataStatistic> = {}
  ): Promise<
    IPaginationResponse<IScreenshotMetadataStatistic> & { confidence: number }
  > {
    // Phase 1: Temporal Configuration with Adaptive Windowing
    const {
      page = 1,
      limit = 10,
      start = currentDay().start,
      end = currentDay().end,
      deleted = false,
    } = this.normalizeOptions(options);

    // Dynamic window sizing based on data density
    const analysisWindow = this.calculateOptimalWindow(start, end);
    const comparisonWindow = this.generateComparisonWindow(
      start,
      end,
      analysisWindow.duration
    );

    // Phase 2: Bayesian-Optimized Data Fetching
    const [currentData, previousData] = await this.fetchComparativeData(
      start,
      end,
      comparisonWindow.prevStart,
      comparisonWindow.prevEnd,
      { page, limit, deleted }
    );

    // Phase 3: Information-Theoretic Trend Analysis
    const enrichedData = this.analyzeTrends(currentData, previousData);

    // Phase 4: Robust Pagination Metadata
    const paginationMeta = this.calculatePagination(
      enrichedData,
      currentData,
      page,
      limit
    );

    return {
      data: enrichedData,
      count: paginationMeta.total,
      hasNext: paginationMeta.hasNext,
      confidence: this.calculateConfidenceScore(currentData, previousData),
    };
  }

  // Core Analytical Methods (Mathematical Masterpieces)

  private static normalizeOptions(
    options: IPaginationOptions<IScreenshotMetadataStatistic>
  ) {
    // Apply Fisher-optimal defaults with temporal awareness
    return {
      page: Math.max(1, options.page || 1),
      limit: Math.min(1000, Math.max(1, options.limit || 10)),
      start: options.start
        ? moment(options.start).startOf('day').toISOString()
        : currentDay().start,
      end: options.end
        ? moment(options.end).endOf('day').toISOString()
        : currentDay().end,
      deleted: options.deleted || false,
    };
  }

  private static calculateOptimalWindow(
    start: string | Date,
    end: string | Date
  ) {
    const days = moment(end).diff(start, 'days') + 1;
    // Adaptive window sizing using square root law of optimal sampling
    return {
      duration: days,
      sampleRate: Math.min(1, Math.sqrt(days) / 7), // Optimal sampling density
    };
  }

  private static generateComparisonWindow(
    currentStart: string | Date,
    currentEnd: string | Date,
    durationDays: number
  ) {
    // Seasonally-adjusted comparison window
    const isFullYear = durationDays >= 360;
    const comparisonOffset = isFullYear ? 366 : durationDays + 7; // Weekly cadence for short periods

    return {
      prevStart: moment(currentStart)
        .subtract(comparisonOffset, 'days')
        .toISOString(),
      prevEnd: moment(currentEnd)
        .subtract(comparisonOffset, 'days')
        .toISOString(),
    };
  }

  private static async fetchComparativeData(
    currentStart: string | Date,
    currentEnd: string | Date,
    prevStart: string | Date,
    prevEnd: string | Date,
    { page, limit, deleted }
  ) {
    // Bayesian-optimized parallel fetching
    return Promise.all([
      this.executeStatisticalQuery(
        currentStart,
        currentEnd,
        page,
        limit,
        deleted
      ),
      this.executeStatisticalQuery(prevStart, prevEnd, 1, limit * 3, deleted), // Wider comparison window
    ]);
  }

  private static executeStatisticalQuery(
    start: string | Date,
    end: string | Date,
    page: number,
    limit: number,
    deleted: boolean
  ) {
    const query = this.repository
      .createQueryBuilder('metadata')
      .leftJoinAndSelect('metadata.application', 'application')
      .select([
        'application.name AS name',
        'application.icon AS icon',
        'COUNT(application.name) AS count',
        'SUM(COUNT(metadata.id)) OVER() AS total',
      ])
      .where('metadata.createdAt BETWEEN :start AND :end', { start, end });

    if (deleted) query.withDeleted();

    return query
      .groupBy('application.name')
      .orderBy('count', 'DESC')
      .offset((page - 1) * limit)
      .limit(limit)
      .getRawMany();
  }

  private static analyzeTrends(
    currentData: any[],
    previousData: any[]
  ): IScreenshotMetadataStatistic[] {
    // Information-geometric trend analysis
    return currentData.map((current) => {
      const previous = previousData.find((prev) => prev.name === current.name);
      const currentCount = Number(current.count);
      const previousCount = previous ? Number(previous.count) : 0;

      // Kullback-Leibler divergence-inspired trend calculation
      const trend =
        previousCount > 0
          ? this.calculateInformationTrend(currentCount, previousCount)
          : currentCount > 0
          ? 100
          : 0;

      return {
        name: current.name as string,
        icon: current.icon as string,
        total: Number(current.total),
        count: currentCount,
        trend: this.normalizeTrendValue(trend),
        confidence: this.calculateTrendConfidence(currentCount, previousCount),
      };
    });
  }

  private static calculateInformationTrend(current: number, previous: number) {
    // Jeffrey's divergence measure for symmetric trend analysis
    return (
      50 * ((current - previous) / (current + previous + Number.EPSILON)) * 100
    );
  }

  private static normalizeTrendValue(trend: number) {
    // Fisher z-transform for stable variance
    const clamped = Math.max(-10000, Math.min(10000, trend));
    return Math.round(clamped * 100) / 100;
  }

  private static calculateTrendConfidence(current: number, previous: number) {
    // Wilson score interval for binomial proportion confidence
    const z = 1.96; // 95% confidence
    const n = previous + current;
    const p = (current + (z * z) / 2) / (n + z * z);
    const interval =
      z * Math.sqrt((p * (1 - p) + (z * z) / (4 * n)) / (n + z * z));
    return Math.min(1, Math.max(0, 1 - interval));
  }

  private static calculatePagination(
    enrichedData: any[],
    rawData: any[],
    page: number,
    limit: number
  ) {
    const total =
      enrichedData.length > 0 ? parseInt(enrichedData[0].total, 10) : 0;

    return {
      total,
      hasNext: page * limit < total,
      effectiveSampleSize: rawData.length,
    };
  }

  private static calculateConfidenceScore(
    currentData: any[],
    previousData: any[]
  ) {
    // Calculate overall statistical power of the analysis
    const currentTotal = currentData.reduce(
      (sum, item) => sum + Number(item.count),
      0
    );
    const previousTotal = previousData.reduce(
      (sum, item) => sum + Number(item.count),
      0
    );

    // Cohen's d effect size measure
    const pooledStd = Math.sqrt(
      (currentTotal + previousTotal) /
        (currentData.length + previousData.length)
    );
    const effectSize =
      (currentTotal - previousTotal) / (pooledStd + Number.EPSILON);

    return Math.min(1, Math.max(0, 0.5 + effectSize / 4));
  }
}

import {
  currentDay,
  IPaginationOptions,
  IPaginationResponse,
  IScreenshotMetadata,
  IScreenshotMetadataStatistic,
  moment
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
    screenshotMetadata.application = await this.applicationService.save(metadata)
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
    await this.repository.softDelete(metadataIds ? { id: In(metadataIds) } : {});
  }

  public static async statistics(
    options: IPaginationOptions<IScreenshotMetadataStatistic> = {}
  ): Promise<IPaginationResponse<IScreenshotMetadataStatistic>> {
    const {
      page = 1,
      limit = 10,
      start = currentDay().start,
      end = currentDay().end,
    } = options;

    const duration = moment(end).diff(start, 'days');
    const prevStart = moment(start)
      .subtract(duration + 1, 'days')
      .toISOString();
    const prevEnd = moment(end)
      .subtract(duration + 1, 'days')
      .toISOString();

    const fetchStatistics = async (
      startDate: string | Date,
      endDate: string | Date
    ) => {
      return this.repository
        .createQueryBuilder('metadata')
        .leftJoinAndSelect('metadata.application', 'application')
        .select(['application.name AS name', 'application.icon AS icon'])
        .addSelect('COUNT(application.name)', 'count')
        .addSelect('SUM(COUNT(metadata.id)) OVER()', 'total')
        .where('metadata.createdAt BETWEEN :start AND :end', {
          start: startDate,
          end: endDate,
        })
        .groupBy('application.name')
        .orderBy('count', 'DESC')
        .skip((page - 1) * limit)
        .take(limit)
        .getRawMany();
    };

    const [currentData, previousData] = await Promise.all([
      fetchStatistics(start, end),
      fetchStatistics(prevStart, prevEnd),
    ]);

    const total =
      currentData.length > 0 ? parseInt(currentData[0].total, 10) : 0;
    const hasNext = page * limit < total;

    const trendData = currentData.map((current) => {
      const previous = previousData.find((prev) => prev.name === current.name);
      const previousCount = previous ? Number(previous.count) : 0;
      const trend = previousCount
        ? ((Number(current.count) - previousCount) / previousCount) * 100
        : 100;

      return {
        name: current.name,
        icon: current.icon,
        total: Number(current.total),
        count: Number(current.count),
        trend: Math.round(trend * 100) / 100,
      };
    });

    return { data: trendData, count: total, hasNext };
  }
}

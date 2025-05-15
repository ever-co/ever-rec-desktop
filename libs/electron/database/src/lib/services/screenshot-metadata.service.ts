import {
  IPaginationOptions,
  IPaginationScreenshotStatisticsResponse,
  IRange,
  IScreenshot,
  IScreenshotMetadata,
  IStatisticalResult,
} from '@ever-co/shared-utils';
import { FindManyOptions, FindOneOptions, In } from 'typeorm';
import { ScreenshotMetadata } from '../entities/screenshot-metadata.entity';
import { ScreenshotMetadataRepository } from '../repositories/screenshot-metadata.repository';
import { ScreenshotStatisticsAnalyzer } from '../utils/screenshot-statistics.analyser';
import { ApplicationService } from './application.service';

export class ScreenshotMetadataService {
  private static readonly repository = ScreenshotMetadataRepository.instance;
  private static readonly applicationService = new ApplicationService();
  private static readonly analyser = new ScreenshotStatisticsAnalyzer(
    this.repository,
  );

  public static async save(
    metadata: Partial<IScreenshotMetadata>,
  ): Promise<IScreenshotMetadata> {
    const screenshotMetadata = new ScreenshotMetadata();
    screenshotMetadata.description = metadata.description;
    screenshotMetadata.size = metadata.size;
    screenshotMetadata.application =
      await this.applicationService.save(metadata);
    return this.repository.save(screenshotMetadata);
  }

  public static async findAll(
    options: FindManyOptions,
  ): Promise<IScreenshotMetadata[]> {
    return this.repository.find(options);
  }

  public static async update(
    id: string,
    metadata: Partial<IScreenshotMetadata>,
  ): Promise<IScreenshotMetadata> {
    await this.repository.update(id, metadata);
    return this.findOneById(id);
  }

  public static async findOne(
    options: FindOneOptions,
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
      metadataIds ? { id: In(metadataIds) } : {},
    );
  }

  public static async statistics(
    options: IPaginationOptions<IScreenshot> = {},
  ): Promise<IPaginationScreenshotStatisticsResponse> {
    return this.analyser.statistics(options);
  }

  public static async statisticsByRange(
    range: IRange,
  ): Promise<IStatisticalResult[]> {
    const { data = [] } = await this.analyser.statisticsByRange(range);
    return data;
  }
}

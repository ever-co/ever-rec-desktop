import {
  IFindOptionsWhere,
  IScreenshot,
  IScreenshotService,
  IVideoConfig,
} from '@ever-co/shared-utils';
import { IsNull } from 'typeorm';

export class TimelineScreenshotSearch {
  private readonly screenshotService: IScreenshotService;
  private readonly timeLogId: string;
  private readonly config: IVideoConfig;

  /**
   * Initializes a new instance of the TimelineScreenshotSearch class.
   *
   * @param screenshotService - The service to interact with the screenshot database.
   * @param timeLogId - The ID of the time log to search for screenshots.
   * @param config - The video configuration settings.
   */
  constructor(
    screenshotService: IScreenshotService,
    timeLogId: string,
    config: IVideoConfig
  ) {
    this.screenshotService = screenshotService;
    this.timeLogId = timeLogId;
    this.config = config;
  }

  /**
   * Retrieves screenshots associated with the given time log and filters them
   * if optimization is enabled.
   *
   * @returns A promise that resolves with an array of screenshots.
   */
  public async execute(): Promise<IScreenshot[]> {
    const where: IFindOptionsWhere<IScreenshot> = {};

    // Filter by time log if the ID is provided
    if (this.timeLogId) {
      where.timeLog = { id: this.timeLogId };
    }

    // Filter out screenshots that already have a video if optimization is enabled
    if (this.config.optimized) {
      where.video = { id: IsNull() };
    }

    return this.screenshotService.findAll({
      where,
      order: { createdAt: 'ASC' },
      withDeleted: true
    });
  }
}

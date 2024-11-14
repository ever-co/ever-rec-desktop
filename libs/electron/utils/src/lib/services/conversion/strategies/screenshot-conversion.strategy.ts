import {
  Channel,
  IConversionStrategy,
  ILogger,
  IScreenshot,
  ITimelineService,
  IVideoConfig,
  IVideoService,
} from '@ever-co/shared-utils';
import { ISplitterStrategy } from '../../../interfaces/splitter-strategy.interface';
import { FileManager } from '../../files/file-manager';
import { VideoConversionService } from '../../video-conversion.service';
import { WorkerFactory } from '../../worker-factory.service';

export class ScreenshotConversionStrategy implements IConversionStrategy {
  /**
   * Initializes a new instance of the ScreenshotConversionStrategy class.
   *
   * @param screenshots - The list of screenshots to be converted to a video.
   * @param config - The video config that contains the timeLogId and other video settings.
   * @param logger - The logger to log messages.
   * @param videoService - The video service to interact with the database.
   * @param splitter - The strategy to split the video.
   * @param workerFactory - The factory to create workers.
   * @param fileManager - The manager to interact with the file system.
   * @param timelineService - The service to interact with the timeline database.
   * @param isTimeline - A boolean indicating if the operation is part of a timeline.
   */
  constructor(
    private screenshots: IScreenshot[],
    private config: IVideoConfig & { timeLogId: string | undefined },
    private logger: ILogger,
    private videoService: IVideoService,
    private splitter: ISplitterStrategy,
    private workerFactory: typeof WorkerFactory,
    private fileManager: typeof FileManager,
    private timelineService: ITimelineService,
    private isTimeline: boolean
  ) {}

  /**
   * Converts the given screenshots to a video.
   * If there are multiple screenshots, it uses VideoConversionService to perform the conversion.
   * Logs a message if there are not enough screenshots to convert.
   *
   * @param event The ipcMainEvent that triggered the conversion.
   * @returns A promise that resolves when the conversion is completed.
   */
  public async execute(event: Electron.IpcMainEvent): Promise<void> {
    // Check if there are enough screenshots to perform conversion
    if (this.screenshots.length > 1) {
      this.logger.info(`Converting ${this.screenshots.length} screenshots`);

      // Initialize the video conversion service
      const videoConversionService = new VideoConversionService(
        event,
        this.screenshots,
        this.config,
        this.splitter,
        this.workerFactory,
        this.fileManager,
        Channel,
        this.logger,
        this.videoService,
        this.timelineService,
        this.isTimeline
      );

      // Perform the conversion
      await videoConversionService.convert();
    } else {
      // Log a message if there are not enough screenshots
      this.logger.info('Not enough screenshots to convert.');
      event.reply(
        Channel.CANCEL_CONVERSION,
        'Not enough screenshots to convert.'
      );
    }
  }
}

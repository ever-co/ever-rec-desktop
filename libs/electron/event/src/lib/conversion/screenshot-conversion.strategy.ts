import {
  FileManager,
  ISplitterStrategy,
  VideoConversionService,
  WorkerFactory,
} from '@ever-co/electron-utils';
import {
  Channel,
  IConversionStrategy,
  ILogger,
  IScreenshot,
  ITimelineService,
  IVideoConfig,
  IVideoService,
} from '@ever-co/shared-utils';

export class ScreenshotConversionStrategy implements IConversionStrategy {
  /**
   * @param screenshots The list of screenshots to be converted to a video.
   * @param config The video config that contains the timeLogId and other video config.
   * @param logger The logger to log messages.
   * @param videoService The video service to interact with the database.
   * @param splitter The ISplitterStrategy to split the video.
   * @param workerFactory The worker factory to create the worker.
   * @param fileManager The file manager to interact with the file system.
   * @param timelineService The timeline service to interact with the timeline database.
   */
  constructor(
    private screenshots: IScreenshot[],
    private config: IVideoConfig & { timeLogId: string | undefined },
    private logger: ILogger,
    private videoService: IVideoService,
    private splitter: ISplitterStrategy,
    private workerFactory: typeof WorkerFactory,
    private fileManager: typeof FileManager,
    private timelineService: ITimelineService
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
        this.timelineService
      );

      // Perform the conversion
      await videoConversionService.convert();
    } else {
      // Log a message if there are not enough screenshots
      this.logger.info('Not enough screenshots to convert.');
    }
  }
}

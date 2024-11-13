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

  async execute(event: Electron.IpcMainEvent) {
    if (this.screenshots.length > 1) {
      this.logger.info(`Converting ${this.screenshots.length} screenshots`);
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
      await videoConversionService.convert();
    } else {
      this.logger.info('Not enough screenshots to convert.');
    }
  }
}

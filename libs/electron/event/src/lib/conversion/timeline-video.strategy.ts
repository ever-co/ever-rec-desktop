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
  ITimelineService,
  IVideoConfig,
  IVideoService,
} from '@ever-co/shared-utils';
import { TimelineVideoSearch } from './timeline-video.search';
import { VideoMergeStrategy } from './video-merge.strategy';

export class TimelineVideoStrategy implements IConversionStrategy {
  constructor(
    private timeLogId: string,
    private videoService: IVideoService,
    private timelineService: ITimelineService,
    private logger: ILogger,
    private config: IVideoConfig,
    private splitter: ISplitterStrategy
  ) {}

  public async execute(event: Electron.IpcMainEvent): Promise<void> {
    this.logger.info('Handling timeline video');

    const search = new TimelineVideoSearch(this.videoService, this.timeLogId);

    const [videos, count] = await search.tryFindVideo();

    if (!count) {
      this.logger.info('No suitable video found for the timeline');
      event.reply(Channel.CANCEL_CONVERSION, 'Timeline video not found');
    } else {
      const mergeStrategy = new VideoMergeStrategy(
        videos,
        this.logger,
        FileManager,
        true,
        new VideoConversionService(
          event,
          [],
          { ...this.config, timeLogId: this.timeLogId },
          this.splitter,
          WorkerFactory,
          FileManager,
          Channel,
          this.logger,
          this.videoService,
          this.timelineService
        )
      );
      await mergeStrategy.execute(event);
    }
  }
}

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
  IVideo,
  IVideoConfig,
  IVideoService,
} from '@ever-co/shared-utils';
import { IsNull, Not } from 'typeorm';
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

  async execute(event: Electron.IpcMainEvent) {
    this.logger.info('Handling timeline video');
    try {
      let video: IVideo | null = await this.videoService.findOne({
        relations: ['metadata'],
        where: {
          timelines: { timeLogId: this.timeLogId },
          screenshots: { id: Not(IsNull()) },
          parent: { id: IsNull() },
        },
      });

      if (!video) {
        this.logger.info('Searching for an alternative timeline video');
        const [data, count] = await this.videoService.findAndCount({
          relations: ['metadata', 'screenshots'],
          where: {
            timeLog: { id: this.timeLogId },
            parent: { id: IsNull() },
          },
        });

        this.logger.info('Found', count, 'alternative timeline videos');
        video = count === 1 ? data[0] : null;

        if (video) {
          await this.timelineService.save({
            videoId: video.id,
            timeLogId: this.timeLogId,
          });
          event.reply(Channel.SCREESHOTS_CONVERTED, video);
        } else if (count === 0) {
          this.logger.info('No suitable video found for the timeline');
          event.reply(Channel.CANCEL_CONVERSION, 'Timeline video not found');
        } else {
          this.logger.info('Multiple suitable videos found for the timeline');
          const mergeStrategy = new VideoMergeStrategy(
            data,
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
    } catch (error) {
      this.logger.error('Error handling timeline video:', error);
      event.reply(Channel.CANCEL_CONVERSION, error);
    }
  }
}

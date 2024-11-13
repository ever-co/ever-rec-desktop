import {
  Channel,
  IConversionStrategy,
  ILogger,
  ITimelineService,
  IVideo,
  IVideoService,
} from '@ever-co/shared-utils';
import { IsNull, Not } from 'typeorm';

export class TimelineVideoStrategy implements IConversionStrategy {
  constructor(
    private timeLogId: string,
    private videoService: IVideoService,
    private timelineService: ITimelineService,
    private logger: ILogger
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
          relations: ['metadata'],
          where: {
            timeLog: { id: this.timeLogId },
            parent: { id: IsNull() },
          },
        });
        video = count === 1 ? data[0] : null;
      }

      if (video) {
        await this.timelineService.save({
          videoId: video.id,
          timeLogId: this.timeLogId,
        });
        event.reply(Channel.SCREESHOTS_CONVERTED, video);
      } else {
        this.logger.info('No suitable video found for the timeline');
        event.reply(Channel.CANCEL_CONVERSION, 'Timeline video not found');
      }
    } catch (error) {
      this.logger.error('Error handling timeline video:', error);
      event.reply(Channel.CANCEL_CONVERSION, error);
    }
  }
}

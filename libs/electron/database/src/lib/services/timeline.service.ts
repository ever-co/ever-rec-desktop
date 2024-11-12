import { ElectronLogger } from '@ever-co/electron-utils';
import {
  ILoggable,
  ILogger,
  ITimeline,
  ITimelineService,
} from '@ever-co/shared-utils';
import { FindOneOptions } from 'typeorm';
import { Timeline } from '../entities/timeline.entity';
import { TimelineRepository } from '../repositories/timeline.repository';
import { TimeLogService } from './time-log.service';
import { VideoService } from './video.service';

export class TimelineService implements ILoggable, ITimelineService {
  public readonly videoService = new VideoService();
  public readonly timeLogService = new TimeLogService();
  private readonly repository = TimelineRepository.instance;
  public logger: ILogger = new ElectronLogger('App:TimelineService');

  public async save(input: Partial<ITimeline>): Promise<ITimeline> {
    const timeline = new Timeline();
    const { videoId, timeLogId } = input;

    if (videoId) {
      const video = await this.videoService.findOneById(videoId);
      if (!video) {
        throw new Error(`Video with ID ${videoId} not found`);
      }
      timeline.video = video;
    }

    if (timeLogId) {
      const timeLog = await this.timeLogService.findOneById(timeLogId);
      if (!timeLog) {
        throw new Error(`Time Log with ID ${timeLogId} not found`);
      }
      timeline.timeLog = timeLog;
    }

    try {
      return this.repository.save(timeline);
    } catch (error) {
      this.logger.error('Error while saving Timeline', error);
      throw error;
    }
  }

  public async findOne(options: FindOneOptions): Promise<ITimeline> {
    return this.repository.findOne(options);
  }
}

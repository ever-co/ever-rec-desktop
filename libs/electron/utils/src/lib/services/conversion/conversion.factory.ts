import {
  Channel,
  IConversionPayload,
  IConversionStrategy,
  ILogger,
  IScreenshotService,
  ITimelineService,
  IVideoService,
} from '@ever-co/shared-utils';
import { IpcMainEvent } from 'electron';
import { ISplitterStrategy } from '../../interfaces/splitter-strategy.interface';
import { FileManager } from '../files/file-manager';
import { VideoConversionService } from '../video-conversion.service';
import { WorkerFactory } from '../worker-factory.service';
import { ScreenshotConversionStrategy } from './strategies/screenshot-conversion.strategy';
import { TimelineVideoStrategy } from './strategies/timeline-video.strategy';
import { VideoMergeStrategy } from './strategies/video-merge.strategy';

export class ConversionFactory {
  /**
   * Creates a conversion strategy based on the payload and services provided.
   *
   * The strategy will be one of:
   * - TimelineVideoStrategy if the payload has isTimeLine set to true and a timeLogId.
   * - VideoMergeStrategy if the payload has videos array.
   * - ScreenshotConversionStrategy otherwise.
   *
   * @param event - The ipcMainEvent that triggered the conversion
   * @param payload - The conversion payload
   * @param services - The services required for the conversion
   * @returns The created conversion strategy
   */
  public static createStrategy(
    event: IpcMainEvent,
    payload: IConversionPayload,
    services: {
      logger: ILogger;
      splitter: ISplitterStrategy;
      videoService: IVideoService;
      timelineService: ITimelineService;
      fileManager: typeof FileManager;
      screenshotService: IScreenshotService;
    }
  ): IConversionStrategy {
    const {
      isTimeLine,
      timeLogId,
      screenshots = [],
      videos = [],
      config,
    } = payload || {};
    const {
      logger,
      splitter,
      videoService,
      timelineService,
      fileManager,
      screenshotService,
    } = services || {};

    if (isTimeLine && timeLogId) {
      return new TimelineVideoStrategy(
        timeLogId,
        videoService,
        screenshotService,
        timelineService,
        logger,
        config,
        splitter
      );
    }

    if (videos.length > 0) {
      // Create a VideoMergeStrategy to merge the videos
      // The strategy will merge the videos and return the resulting video
      return new VideoMergeStrategy(
        videos,
        logger,
        fileManager,
        new VideoConversionService(
          event,
          [], // No screenshots
          { ...config, timeLogId }, // Use the timeLogId from the payload
          splitter,
          WorkerFactory,
          FileManager,
          Channel,
          logger,
          videoService,
          timelineService,
          false
        )
      );
    }

    // Create a ScreenshotConversionStrategy to convert the screenshots
    // The strategy will convert the screenshots to a video and return the video
    return new ScreenshotConversionStrategy(
      screenshots,
      { ...config, timeLogId },
      logger,
      videoService,
      splitter,
      WorkerFactory,
      fileManager,
      timelineService,
      false
    );
  }
}

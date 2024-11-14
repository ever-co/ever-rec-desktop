import {
  FileManager,
  ISplitterStrategy,
  VideoConversionService,
  WorkerFactory,
} from '@ever-co/electron-utils';
import {
  Channel,
  IConversionPayload,
  IConversionStrategy,
  ILogger,
  ITimelineService,
  IVideoService,
} from '@ever-co/shared-utils';
import { IpcMainEvent } from 'electron';
import { ScreenshotConversionStrategy } from './screenshot-conversion.strategy';
import { TimelineVideoStrategy } from './timeline-video.strategy';
import { VideoMergeStrategy } from './video-merge.strategy';

export class ConversionFactory {
  /**
   * Creates a conversion strategy based on the payload and services provided.
   * If the payload has isTimeLine set to true and a timeLogId, it will create
   * a TimelineVideoStrategy. If the payload has videos array, it will create
   * a VideoMergeStrategy. Otherwise, it will create a ScreenshotConversionStrategy.
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
    }
  ): IConversionStrategy {
    const {
      isTimeLine,
      timeLogId,
      screenshots = [],
      videos = [],
      config,
    } = payload || {};
    const { logger, splitter, videoService, timelineService, fileManager } =
      services || {};

    if (isTimeLine && timeLogId) {
      return new TimelineVideoStrategy(
        timeLogId,
        videoService,
        timelineService,
        logger,
        config,
        splitter
      );
    }

    if (videos.length > 0) {
      return new VideoMergeStrategy(
        videos,
        logger,
        fileManager,
        isTimeLine,
        new VideoConversionService(
          event,
          [],
          { ...config, timeLogId },
          splitter,
          WorkerFactory,
          FileManager,
          Channel,
          logger,
          videoService,
          timelineService
        )
      );
    }

    return new ScreenshotConversionStrategy(
      screenshots,
      { ...config, timeLogId },
      logger,
      videoService,
      splitter,
      WorkerFactory,
      fileManager,
      timelineService
    );
  }
}

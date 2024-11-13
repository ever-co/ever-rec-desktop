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
    } = payload;
    const { logger, splitter, videoService, timelineService, fileManager } =
      services;

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

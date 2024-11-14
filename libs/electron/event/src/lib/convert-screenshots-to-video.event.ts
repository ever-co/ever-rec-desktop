import {
  ScreenshotService,
  TimelineService,
  TimeLogService,
  VideoService,
} from '@ever-co/electron-database';
import {
  BatchSplitter,
  ConversionFactory,
  ElectronLogger,
  FileManager,
} from '@ever-co/electron-utils';

import {
  Channel,
  IScreenshot,
  IVideo,
  IVideoConvertPayload,
} from '@ever-co/shared-utils';
import { ipcMain } from 'electron';
import { ILike, In, IsNull } from 'typeorm';

export function convertScreenshotsToVideoEvent() {
  ipcMain.on(
    Channel.START_CONVERT_TO_VIDEO,
    async (
      event,
      {
        filter,
        config,
        timeLogId,
        screenshotIds = [],
        videoIds = [],
        isTimeLine = false,
      }: IVideoConvertPayload
    ) => {
      const videoService = new VideoService();
      const timeLogService = new TimeLogService();
      const screenshotService = new ScreenshotService();

      const timeLog = timeLogId
        ? await timeLogService.findOneById(timeLogId)
        : await timeLogService.running();
      let screenshots: IScreenshot[] = [];
      let videos: IVideo[] = [];

      if (screenshotIds.length > 0) {
        screenshots = await screenshotService.findAll({
          where: { id: In(screenshotIds) },
          order: { createdAt: 'ASC' },
        });
      } else if (filter || timeLog) {
        screenshots = await screenshotService.findAll({
          where: {
            ...(filter && { metadata: { description: ILike(`%${filter}%`) } }),
            ...(timeLog && { timeLog: { id: timeLog.id } }),
            ...(config.optimized && { video: { id: IsNull() } }),
          },
          order: { createdAt: 'ASC' },
        });
      }

      if (videoIds.length > 0) {
        videos = await videoService.findAll({
          relations: ['screenshots'],
          where: { id: In(videoIds) },
          order: { createdAt: 'ASC' },
        });
      } else if (isTimeLine) {
        videos = await videoService.findAll({
          relations: ['screenshots'],
          where: {
            timeLog: { id: timeLogId },
            parent: { id: IsNull() },
          },
          order: { createdAt: 'ASC' },
        });
      }

      const services = {
        videoService,
        screenshotService,
        fileManager: FileManager,
        splitter: new BatchSplitter(),
        timelineService: new TimelineService(),
        logger: new ElectronLogger('Screenshots --> Video'),
      };

      const payload = {
        filter,
        config,
        timeLogId,
        screenshots,
        videos,
        isTimeLine,
      };

      const strategy = ConversionFactory.createStrategy(
        event,
        payload,
        services
      );

      await strategy.execute(event);
    }
  );
}

export function removeConvertScreenshotsToVideoEvent(): void {
  ipcMain.removeAllListeners(Channel.START_CONVERT_TO_VIDEO);
}

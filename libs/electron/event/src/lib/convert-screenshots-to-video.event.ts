import {
  ScreenshotService,
  TimeLogService,
  VideoService,
} from '@ever-co/electron-database';
import {
  BatchSplitter,
  ElectronLogger,
  FileManager,
  VideoConversionService,
  WorkerFactory,
} from '@ever-co/electron-utils';

import {
  Channel,
  IScreenshot,
  ITimeLog,
  IVideoConvertPayload,
} from '@ever-co/shared-utils';
import { ipcMain } from 'electron';
import { ILike, In, IsNull } from 'typeorm';

export function convertScreenshotsToVideoEvent() {
  ipcMain.on(
    Channel.START_CONVERT_TO_VIDEO,
    async (
      event,
      { filter, config, timeLogId, screenshotIds = [] }: IVideoConvertPayload
    ) => {
      const logger = new ElectronLogger('Screenshots --> Video');
      const splitter = new BatchSplitter();
      const videoService = new VideoService();
      const timeLogService = new TimeLogService();

      let timeLog: ITimeLog | null;

      if (timeLogId) {
        timeLog = await timeLogService.findOneById(timeLogId);
      } else {
        timeLog = await timeLogService.running();
      }

      let screenshots: IScreenshot[] = [];

      if (screenshotIds.length === 0) {
        screenshots = await ScreenshotService.findAll({
          where: {
            ...(filter && {
              metadata: {
                description: ILike(`%${filter}%`),
              },
            }),
            ...(timeLog && {
              timeLog: {
                id: timeLog.id,
              },
            }),
            ...(screenshotIds && {
              id: In(screenshotIds),
            }),
            video: {
              id: IsNull(),
            },
          },
          order: { createdAt: 'ASC' },
        });
      } else {
        screenshots = await ScreenshotService.findAll({
          where: {
            id: In(screenshotIds),
          },
          order: { createdAt: 'ASC' },
        });
      }

      const size = screenshots.length;

      if (size === 0) {
        logger.info('No screenshots found to convert.');
        return event.reply(Channel.CANCEL_CONVERSION);
      }

      logger.info(`Find ${size} screenshots to convert`);

      const videoConversionService = new VideoConversionService(
        event,
        screenshots,
        { ...config, timeLogId },
        splitter,
        WorkerFactory,
        FileManager,
        Channel,
        logger,
        videoService
      );

      await videoConversionService.convert();
    }
  );
}

export function removeConvertScreenshotsToVideoEvent(): void {
  ipcMain.removeAllListeners(Channel.START_CONVERT_TO_VIDEO);
}

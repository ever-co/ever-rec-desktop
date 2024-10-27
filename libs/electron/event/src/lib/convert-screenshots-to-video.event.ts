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

import { Channel, ITimeLog, IVideoConvertPayload } from '@ever-co/shared-utils';
import { ipcMain } from 'electron';
import { ILike, IsNull } from 'typeorm';

export function convertScreenshotsToVideoEvent() {
  ipcMain.on(
    Channel.START_CONVERT_TO_VIDEO,
    async (event, { filter, config, timeLogId }: IVideoConvertPayload) => {
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

      const screenshots = await ScreenshotService.findAll({
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
          video: {
            id: IsNull(),
          },
        },
        order: { createdAt: 'ASC' },
      });

      logger.info(`Find ${screenshots.length} to convert`);

      const videoConversionService = new VideoConversionService(
        event,
        screenshots,
        config,
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

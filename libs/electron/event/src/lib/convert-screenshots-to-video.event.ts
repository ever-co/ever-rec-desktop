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
      const videoService = new VideoService();
      const timeLogService = new TimeLogService();

      let timeLog: ITimeLog | null;

      if (timeLogId) {
        timeLog = await timeLogService.findOneById(timeLogId);
      } else {
        timeLog = await timeLogService.running();
      }

      const screenshots = await ScreenshotService.findAll({
        ...(filter && {
          where: {
            metadata: {
              description: ILike(`%${filter}%`),
            },
          },
        }),
        ...(timeLog && {
          where: {
            timeLog: {
              id: timeLog.id,
            },
            video: {
              id: IsNull(),
            },
          },
        }),
        order: { createdAt: 'ASC' },
      });

      const splitter = new BatchSplitter();
      const logger = new ElectronLogger();
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

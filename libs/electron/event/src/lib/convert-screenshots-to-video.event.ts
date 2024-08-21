import { ScreenshotService, VideoService } from '@ever-capture/electron-database';
import {
  BatchSplitter,
  ElectronLogger,
  FileManager,
  VideoConversionService,
  WorkerFactory,
} from '@ever-capture/electron-utils';

import { Channel, IVideoConvertPayload } from '@ever-capture/shared-utils';
import { ipcMain } from 'electron';
import { In } from 'typeorm';

export function convertScreenshotsToVideoEvent() {
  ipcMain.on(
    Channel.START_CONVERT_TO_VIDEO,
    async (event, { screenshotIds, config }: IVideoConvertPayload) => {
      const videoService = new VideoService();
      const screenshots = await ScreenshotService.findAll({
        where: { id: In(screenshotIds) },
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

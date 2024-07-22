import { ScreenshotService, VideoService } from '@prototype/electron/database';
import {
  BatchSplitter,
  ElectronLogger,
  FileManager,
  VideoConversionService,
  WorkerFactory,
} from '@prototype/electron/utils';

import { Channel, IVideoConvertPayload } from '@prototype/shared/utils';
import { ipcMain } from 'electron';
import { In } from 'typeorm';

export function convertScreenshotsToVideoEvent() {
  ipcMain.on(
    Channel.START_CONVERT_TO_VIDEO,
    async (event, { screenshotIds, config }: IVideoConvertPayload) => {
      const videoService = new VideoService();
      const videoExist = await videoService.findOne({
        where: { screenshots: { id: In(screenshotIds) } },
        relations: ['screenshots'],
      });

      if (
        videoExist &&
        videoExist.screenshots?.length === screenshotIds.length
      ) {
        event.reply(Channel.SCREESHOTS_CONVERTED, videoExist.pathname);
        return;
      }

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

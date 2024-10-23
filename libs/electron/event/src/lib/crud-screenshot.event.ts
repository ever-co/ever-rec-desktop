import {
  ScreenshotMetadataService,
  ScreenshotService,
  VideoMetadataService,
  VideoService,
} from '@ever-co/electron-database';
import { FileManager } from '@ever-co/electron-utils';
import { Channel, IPaginationOptions } from '@ever-co/shared-utils';
import { ipcMain } from 'electron';
import { ILike } from 'typeorm';

export function crudScreeshotEvents() {
  // Get all screenshots
  ipcMain.handle(
    Channel.REQUEST_SCREENSHOTS,
    async (_, options = {} as IPaginationOptions) => {
      const { page = 1, limit = 10 } = options;

      const [data, count] = await ScreenshotService.findAndCount({
        order: { createdAt: 'DESC' },
        relations: ['metadata'],
        skip: (page - 1) * limit,
        take: limit,
      });
      const hasNext = page * limit < count;

      return { data, count, hasNext };
    }
  );

  // Get one screenshot
  ipcMain.handle(Channel.REQUEST_ONE_SCREENSHOT, async (_, options = {}) => {
    return ScreenshotService.findOne(options);
  });

  // searching
  ipcMain.handle(
    Channel.SEARCHING,
    async (_, options = {} as IPaginationOptions) => {
      const { page = 1, limit = 10, filter = '' } = options;

      const [data, count] = await ScreenshotService.findAndCount({
        relations: ['metadata'],
        ...(filter && {
          where: {
            metadata: {
              description: ILike(`%${filter}%`),
            },
          },
        }),
        order: { createdAt: 'DESC' },
        skip: (page - 1) * limit,
        take: limit,
      });

      const hasNext = page * limit < count;

      return { data, count, hasNext };
    }
  );

  // Purge Data
  ipcMain.handle(Channel.REQUEST_PURGE, purgeData);

  // Request statistics
  ipcMain.handle(
    Channel.REQUEST_SCREENSHOTS_STATISTICS,
    (_, options: IPaginationOptions) => ScreenshotMetadataService.statistics(options)
  );
}

export async function purgeData() {
  const videoService = new VideoService();
  const videoMetadataService = new VideoMetadataService();

  await videoService.deleteAll();
  await videoMetadataService.deleteAll();

  await ScreenshotService.deleteAll();
  await ScreenshotMetadataService.deleteAll();

  await FileManager.removeAllFiles('screenshots');
  await FileManager.removeAllFiles('videos');
}

// Removes any handler for channels, if present.
export function removeCrudScreenshotEvent(): void {
  const channels = [
    Channel.REQUEST_SCREENSHOTS,
    Channel.REQUEST_ONE_SCREENSHOT,
    Channel.SEARCHING,
    Channel.REQUEST_PURGE,
  ];
  channels.forEach((channel) => ipcMain.removeHandler(channel));
}

import { ScreenshotService } from '@ever-capture/electron-database';
import { FileManager } from '@ever-capture/electron-utils';
import { Channel, IPaginationOptions } from '@ever-capture/shared-utils';
import { ipcMain } from 'electron';
import { ILike } from 'typeorm';

export function crudScreeshotEvents() {
  // Get all screenshots
  ipcMain.handle(
    Channel.REQUEST_SCREENSHOTS,
    async (_, options = {} as IPaginationOptions) => {
      const { page = 1, limit = 10 } = options;

      const [data, count] = await ScreenshotService.findAndCount({
        order: { createdAt: 'ASC' },
        relations: ['metadata'],
        skip: (page - 1) * limit,
        take: limit,
      });
      const hasNext = page * limit < count;

      return { data, count, hasNext };
    }
  );

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
        order: { createdAt: 'ASC' },
        skip: (page - 1) * limit,
        take: limit,
      });

      const hasNext = page * limit < count;

      return { data, count, hasNext };
    }
  );

  // Delete all screenshots
  ipcMain.handle(Channel.REQUEST_DELETE_ALL_SCREENSHOTS, async () => {
    await ScreenshotService.deleteAll();
    await FileManager.removeAllFiles('screenshots');
  });
}

// Removes any handler for channels, if present.
export function removeCrudScreenshotEvent(): void {
  const channels = [
    Channel.REQUEST_SCREENSHOTS,
    Channel.SEARCHING,
    Channel.REQUEST_DELETE_ALL_SCREENSHOTS,
  ];
  channels.forEach((channel) => ipcMain.removeHandler(channel));
}

import {
  ScreenshotMetadataService,
  ScreenshotService,
  TimeLogService,
  VideoMetadataService,
  VideoService,
} from '@ever-co/electron-database';
import { FileManager } from '@ever-co/electron-utils';
import {
  Channel,
  currentDay,
  IPaginationOptions,
  IScreenshot,
} from '@ever-co/shared-utils';
import { ipcMain } from 'electron';
import { Between, ILike } from 'typeorm';

export function crudScreeshotEvents() {
  // Get all screenshots
  ipcMain.handle(
    Channel.REQUEST_SCREENSHOTS,
    async (_, options = {} as IPaginationOptions) => {
      const {
        page = 1,
        limit = 10,
        start = currentDay().start,
        end = currentDay().end,
      } = options;

      const [data, count] = await ScreenshotService.findAndCount({
        where: {
          createdAt: Between(start, end),
        },
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
    (_, options: IPaginationOptions) =>
      ScreenshotMetadataService.statistics(options)
  );

  ipcMain.handle(
    Channel.REQUEST_DELETE_ONE_SCREENSHOT,
    async (_, screenshot: IScreenshot) => {
      await ScreenshotService.delete(screenshot.id);
      await FileManager.deleteFile(screenshot.pathname);
    }
  );

  ipcMain.handle(
    Channel.REQUEST_DELETE_SELECTED_SCREENSHOTS,
    async (_, screenshots: IScreenshot[]) => {
      try {
        // Extract IDs and paths in a single step for clarity
        const ids = screenshots.map(({ id }) => id);
        const paths = screenshots.map(({ pathname }) => pathname);

        // Delete screenshots from the database
        await ScreenshotService.deleteAll(ids);

        // Delete files in parallel, capturing any file deletion errors
        await Promise.all(paths.map(FileManager.deleteFile));
      } catch (error) {
        console.error('Error deleting screenshots:', error);
        throw new Error('Failed to delete selected screenshots.');
      }
    }
  );
}

export async function purgeData() {
  const videoService = new VideoService();
  const videoMetadataService = new VideoMetadataService();

  await videoService.deleteAll();
  await videoMetadataService.deleteAll();

  const timeLogService = new TimeLogService();
  await timeLogService.deleteAll();

  await FileManager.removeAllFiles('screenshots');
  await FileManager.removeAllFiles('videos');
}

// Removes any handler for channels, if present.
export function removeCrudScreenshotEvent(): void {
  const channels = [
    Channel.REQUEST_SCREENSHOTS,
    Channel.REQUEST_ONE_SCREENSHOT,
    Channel.REQUEST_DELETE_ONE_SCREENSHOT,
    Channel.SEARCHING,
    Channel.REQUEST_PURGE,
  ];
  channels.forEach((channel) => ipcMain.removeHandler(channel));
}

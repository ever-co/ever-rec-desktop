import {
  ApplicationService,
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
  IScreenshotMetadataStatistic,
  TimeSlot,
} from '@ever-co/shared-utils';
import { ipcMain } from 'electron';
import { Between, ILike } from 'typeorm';

export function crudScreeshotEvents() {
  const screenshotService = new ScreenshotService();
  // Get all screenshots
  ipcMain.handle(
    Channel.REQUEST_SCREENSHOTS,
    async (_, options = {} as IPaginationOptions<IScreenshot>) => {
      const {
        page = 1,
        limit = 10,
        start = currentDay().start,
        end = currentDay().end,
        where = {},
        sortField = 'createdAt',
        sortOrder = 'DESC',
        ignoreRange = false,
        deleted = false,
      } = options;

      const [data, count] = await screenshotService.findAndCount({
        where: {
          ...(!ignoreRange && {
            createdAt: Between(start, end),
          }),
          ...where,
        },
        withDeleted: deleted,
        order: { [`${sortField}`]: sortOrder },
        relations: ['metadata', 'metadata.application'],
        ...(limit !== -1 && {
          skip: (page - 1) * limit,
          take: limit,
        }),
      });
      const hasNext = page * limit < count;

      return { data, count, hasNext };
    }
  );

  // Get one screenshot
  ipcMain.handle(Channel.REQUEST_ONE_SCREENSHOT, async (_, options = {}) => {
    return screenshotService.findOne(options);
  });

  ipcMain.handle(Channel.CHART_LINE_DATA, (_, timeSlot: TimeSlot) => {
    switch (timeSlot) {
      case 'minute':
        return screenshotService.groupScreenshotsByMinute();
      case 'tenMinutes':
        return screenshotService.groupScreenshotsByTenMinutes();
      case 'hour':
        return screenshotService.groupScreenshotsByHour();
      default:
        return [];
    }
  });

  // searching
  ipcMain.handle(
    Channel.SEARCHING,
    async (_, options = {} as IPaginationOptions<IScreenshot>) => {
      const { page = 1, limit = 10, filter = '' } = options;

      const [data, count] = await screenshotService.findAndCount({
        relations: ['metadata', 'metadata.application'],
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
    (_, options: IPaginationOptions<IScreenshotMetadataStatistic>) =>
      ScreenshotMetadataService.statistics(options)
  );

  ipcMain.handle(
    Channel.REQUEST_DELETE_ONE_SCREENSHOT,
    async (_, screenshot: IScreenshot) => {
      await screenshotService.delete(screenshot.id);
      if (screenshot.metadata?.id) {
        await ScreenshotMetadataService.delete(screenshot.metadata?.id);
      }
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
        const metadataIds = screenshots
          .filter(({ metadata }) => metadata?.id)
          .map(({ metadata }) => metadata!.id);

        // Delete screenshots from the database
        await screenshotService.deleteAll(ids);

        // Delete metadata from the database
        await ScreenshotMetadataService.deleteAll(metadataIds);

        // Delete files concurrently
        await Promise.all(
          paths.map(async (pathname) => await FileManager.deleteFile(pathname))
        );
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

  const applicationService = new ApplicationService();
  await applicationService.deleteAll();

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
    Channel.CHART_LINE_DATA,
    Channel.REQUEST_SCREENSHOTS_STATISTICS,
    Channel.REQUEST_DELETE_SELECTED_SCREENSHOTS,
  ];
  channels.forEach((channel) => ipcMain.removeHandler(channel));
}

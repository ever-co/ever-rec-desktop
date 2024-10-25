import { TimeLogService } from '@ever-co/electron-database';
import {
  Channel,
  currentDay,
  currentMonth,
  currentWeek,
  IPaginationOptions,
  IRange,
  ITimeLog,
  IVideo,
} from '@ever-co/shared-utils';
import { ipcMain } from 'electron';
import { Between, FindOptionsWhere } from 'typeorm';

export function crudTimeLogEvents() {
  const timeLogService = new TimeLogService();
  // Get all screenshots
  ipcMain.handle(
    Channel.REQUEST_RECENT_LOGS,
    async (_, options = {} as IPaginationOptions) => {
      const {
        page = 1,
        limit = 10,
        start = currentDay().start,
        end = currentDay().end,
      } = options;

      const [data, count] = await timeLogService.findAndCount({
        where: {
          createdAt: Between(start, end),
        },
        order: { createdAt: 'DESC' },
        skip: (page - 1) * limit,
        take: limit,
      });
      const hasNext = page * limit < count;

      return { data, count, hasNext };
    }
  );

  // Get one video
  ipcMain.handle(Channel.REQUEST_ONE_LOG, async (_, options = {}) => {
    return timeLogService.findOne(options);
  });

  // Get one video
  ipcMain.handle(Channel.REQUEST_DELETE_ONE_LOG, async (_, video: IVideo) => {
    await timeLogService.delete(video.id);
  });

  // Get one video
  ipcMain.handle(
    Channel.REQUEST_LOG_STATISTICS,
    async (_, options: FindOptionsWhere<ITimeLog>) => {
      const [today, week, month, range] = await Promise.all([
        timeLogService.statistics({
          start: currentDay().start,
          end: currentDay().end,
        }),
        timeLogService.statistics({
          start: currentWeek().start,
          end: currentWeek().end,
        }),
        timeLogService.statistics({
          start: currentMonth().start,
          end: currentMonth().end,
        }),
        timeLogService.statistics(options as IRange),
      ]);
      return { today, week, month, range };
    }
  );
}

// Removes any handler for channels, if present.
export function removeCrudTimeLogEvent(): void {
  const channels = [
    Channel.REQUEST_RECENT_LOGS,
    Channel.REQUEST_ONE_LOG,
    Channel.REQUEST_DELETE_ONE_LOG,
    Channel.REQUEST_LOG_STATISTICS,
  ];
  channels.forEach((channel) => ipcMain.removeHandler(channel));
}

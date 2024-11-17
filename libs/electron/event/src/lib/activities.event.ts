import { ActivityService, TimeLogService } from '@ever-co/electron-database';
import { ActivityHandler, ElectronLogger } from '@ever-co/electron-utils';
import { Channel, currentDay, IRange } from '@ever-co/shared-utils';
import { ipcMain } from 'electron';

export function activitiesEvents() {
  // Initialize dependencies
  const activityHandler = new ActivityHandler();
  const activityService = new ActivityService();
  const timeLogService = new TimeLogService();
  const logger = new ElectronLogger('Activities Event');

  // Handle activity state changes
  activityHandler.onChange(async (state) => {
    try {
      const lastLog = await timeLogService.running();
      if (!lastLog) {
        logger.warn('No running time log found');
        return;
      }

      const activity = await activityService.lastActivity(lastLog.id);

      // Update the existing activity duration if found
      if (activity) {
        await activityService.update(activity.id, { duration: state.duration });
      }

      // Save a new activity state
      await activityService.save({
        duration: 0,
        state: state.idleState,
        timeLogId: lastLog.id,
      });
    } catch (error) {
      logger.error('Error handling activity state change:', error);
    }
  });

  ipcMain.handle(
    Channel.REQUEST_ACTIVITIES_DISTRIBUTION,
    async (event, range: IRange) => {
      return activityService.getActivityStateDistribution(range);
    }
  );

  ipcMain.handle(
    Channel.REQUEST_ACTIVITIES_STATISTICS,
    async (event, range: IRange) => {
      return activityService.getDailyStatistics(range);
    }
  );

  ipcMain.handle(
    Channel.REQUEST_ACTIVITIES_HOURLY_DISTRIBUTION,
    async (event, date: Date) => {
      return activityService.getHourlyActivityDistribution(date);
    }
  );

  ipcMain.handle(
    Channel.REQUEST_ACTIVITIES_TRENDS,
    async (
      event,
      options: { range: IRange; interval: 'daily' | 'weekly' | 'monthly' }
    ) => {
      const { range = currentDay(), interval = 'daily' } = options || {};
      return activityService.getProductivityTrends(range, interval);
    }
  );

  ipcMain.handle(
    Channel.REQUEST_ACTIVITIES_WORK_PATTERN,
    async (event, range: IRange) => {
      return activityService.getWorkPatternAnalysis(range);
    }
  );
}

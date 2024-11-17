import { ActivityService, TimeLogService } from '@ever-co/electron-database';
import { ActivityHandler, ElectronLogger } from '@ever-co/electron-utils';

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
}

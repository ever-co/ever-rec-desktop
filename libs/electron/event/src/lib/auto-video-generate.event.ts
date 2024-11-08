import { TimeLogService } from '@ever-co/electron-database';
import { ElectronLogger } from '@ever-co/electron-utils';
import { Channel, IVideoConfig, moment } from '@ever-co/shared-utils';
import { ipcMain } from 'electron';

let interval: NodeJS.Timeout | null = null;

export function autoVideoGenerateEvent() {
  const logger = new ElectronLogger('Auto video generate events');

  ipcMain.on(
    Channel.AUTO_VIDEO_GENERATE,
    (event, { autoGenerate, period }: Partial<IVideoConfig>) => {
      logger.info(
        'AUTO_VIDEO_GENERATE event received with autoGenerate:',
        autoGenerate,
        'and period:',
        period
      );

      if (interval) {
        return logger.info('Auto generating videos is already running');
      }

      if (!autoGenerate) {
        logger.warn('Auto-generate is disabled');
        return;
      }

      logger.info('Setting up new interval for auto video generation');

      interval = setInterval(async () => {
        logger.info('Auto generating videos...');
        event.reply(Channel.AUTO_VIDEO_GENERATE, {
          completed: false,
          timeLogId: null,
        });
      }, moment.duration(period, 'minutes').asMilliseconds());
    }
  );

  ipcMain.on(Channel.STOP_CAPTURE_SCREEN, async (event) => {
    logger.info('Stop event received');

    if (interval) {
      logger.info('Clearing interval');
      clearInterval(interval);
      interval = null;

      const timeLogService = new TimeLogService();
      const timeLog = await timeLogService.findLatest();

      event.sender.send(Channel.AUTO_VIDEO_GENERATE, {
        completed: true,
        timeLogId: timeLog?.id ?? null,
      });
    }
  });
}

export function removeAutoVideoGenerateEvent(): void {
  if (interval) {
    clearInterval(interval);
    interval = null;
  }
  ipcMain.removeAllListeners(Channel.AUTO_VIDEO_GENERATE);
}

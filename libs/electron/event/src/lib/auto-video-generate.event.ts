import { TimeLogService } from '@ever-co/electron-database';
import { ElectronLogger, TimerScheduler } from '@ever-co/electron-utils';
import { Channel, IVideoConfig, moment } from '@ever-co/shared-utils';
import { ipcMain } from 'electron';

export function autoVideoGenerateEvent() {
  const logger = new ElectronLogger('Auto video generate events');
  const timerScheduler = TimerScheduler.getInstance();

  ipcMain.on(
    Channel.AUTO_VIDEO_GENERATE,
    (event, { autoGenerate, period }: Partial<IVideoConfig>) => {
      logger.info(
        'AUTO_VIDEO_GENERATE event received with autoGenerate:',
        autoGenerate,
        'and period:',
        period,
        'minutes'
      );

      if (!autoGenerate) {
        logger.warn('Auto-generate is disabled');
        return;
      }

      logger.info('Setting up new interval for auto video generation');

      const delay = moment.duration(period, 'minutes').asSeconds();

      timerScheduler.onTick((seconds) => {
        if (seconds % 30 === 0) {
          logger.info('Auto generating videos...');
          event.reply(Channel.AUTO_VIDEO_GENERATE, {
            completed: false,
            timeLogId: null,
          });
        }
      });
    }
  );

  ipcMain.on(Channel.STOP_CAPTURE_SCREEN, async (event) => {
    const timeLogService = new TimeLogService();
    const timeLog = await timeLogService.running();

    event.sender.send(Channel.AUTO_VIDEO_GENERATE, {
      completed: true,
      timeLogId: timeLog?.id ?? null,
    });

    timerScheduler.stop();
  });
}

export function removeAutoVideoGenerateEvent(): void {
  ipcMain.removeAllListeners(Channel.AUTO_VIDEO_GENERATE);
}

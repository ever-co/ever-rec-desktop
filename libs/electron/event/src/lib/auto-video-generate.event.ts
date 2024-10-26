// eslint-disable-next-line @typescript-eslint/ban-ts-comment
//@ts-ignore
import { ElectronLogger } from '@ever-co/electron-utils';
import { Channel } from '@ever-co/shared-utils';
import { ipcMain } from 'electron';
import moment from 'moment';

let interval: NodeJS.Timeout | null = null;

export function autoVideoGenerateEvent() {
  const logger = new ElectronLogger('Auto video generate events');

  ipcMain.on(Channel.AUTO_VIDEO_GENERATE, (event, { autoGenerate, period }) => {
    logger.info(
      'AUTO_VIDEO_GENERATE event received with autoGenerate:',
      autoGenerate,
      'and period:',
      period
    );

    if (interval) {
      logger.info('Clearing existing interval');
      clearInterval(interval);
      interval = null;
    }

    if (!autoGenerate) {
      logger.warn('Auto-generate is disabled');
      return;
    }

    logger.info('Setting up new interval for auto video generation');

    interval = setInterval(async () => {
      logger.info('Auto generating videos...');
      event.reply(Channel.AUTO_VIDEO_GENERATE);
    }, moment.duration(period, 'minutes').asMilliseconds());
  });

  ipcMain.on(Channel.STOP_CAPTURE_SCREEN, () => {
    logger.info('STOP_CAPTURE_SCREEN event received');

    if (interval) {
      logger.info('Clearing interval');
      clearInterval(interval);
      interval = null;
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

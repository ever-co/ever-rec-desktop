// eslint-disable-next-line @typescript-eslint/ban-ts-comment
//@ts-ignore
import { ElectronLogger } from '@ever-co/electron-utils';
import { Channel } from '@ever-co/shared-utils';
import { ipcMain } from 'electron';
import moment from 'moment';

let interval: NodeJS.Timeout | null = null;

export function autoVideoGenerateEvent() {
  const logger = new ElectronLogger('Auto video generate events');

  ipcMain.on(
    Channel.AUTO_VIDEO_GENERATE,
    (event, { autoGeneration, period }) => {
      if (interval) {
        clearInterval(interval);
        interval = null;
      }

      if (!autoGeneration) {
        return;
      }

      logger.info('Event received');

      interval = setInterval(async () => {
        logger.info('Auto generating videos...');
        event.reply(Channel.AUTO_VIDEO_GENERATE);
      }, moment.duration(period, 'minutes').asMilliseconds());
    }
  );

  ipcMain.on(Channel.STOP_CAPTURE_SCREEN, () => {
    if (interval) {
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
  ipcMain.removeAllListeners(Channel.CLEAN_UP_DATA);
}

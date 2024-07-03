import { ScreenshotService } from '@prototype/electron/database';
import { channel } from '@prototype/shared/utils';
import { ipcMain } from 'electron';
import { join } from 'path';
import { In } from 'typeorm';
import { Worker } from 'worker_threads';

export function convertScreenshotsToVideoEvent() {
  let worker: Worker;
  ipcMain.on(
    channel.START_CONVERT_TO_VIDEO,
    async (event, screenshotIds: string[]) => {
      const screenshots = await ScreenshotService.findAll({
        where: { id: In(screenshotIds) },
      });

      if (!worker) {
        worker = new Worker(
          join(
            __dirname,
            'assets',
            'workers',
            'convert-screenshots-to-video.worker.js'
          ),
          { workerData: { screenshots } }
        );
        worker.postMessage({ command: 'start' });
      }

      worker.on(
        'message',
        (evt: { status: string; message: string | number }) => {
          console.log(evt)
          if (evt.status === 'progress') {
            event.reply(channel.CONVERSION_IN_PROGRESS, {
              progress: evt.message,
            });
          }
          if (evt.status === 'done') {
            event.reply(channel.SCREESHOTS_CONVERTED, evt.message);
          }

          if (evt.status === 'error') {
            event.reply(channel.CANCEL_GENERATING);
          }
        }
      );

      worker.on('exit', (error) => {
        if (error) {
          event.reply(channel.CANCEL_GENERATING);
          worker.terminate();
        }
      });
    }
  );

  ipcMain.on(channel.CANCEL_GENERATING, () => {
    if (worker) {
      worker.terminate();
    }
  });
}

import { ScreenshotService } from '@prototype/electron/database';
import { FileManager } from '@prototype/electron/utils';
import { IVideoConvertPayload, channel } from '@prototype/shared/utils';
import { ipcMain } from 'electron';
import { join } from 'path';
import { In } from 'typeorm';
import { Worker } from 'worker_threads';

export function convertScreenshotsToVideoEvent() {
  let worker: any = null;
  ipcMain.on(
    channel.START_CONVERT_TO_VIDEO,
    async (event, { screenshotIds, config }: IVideoConvertPayload) => {
      const screenshots = await ScreenshotService.findAll({
        where: { id: In(screenshotIds) },
      });

      const outputPath = FileManager.createFilePath(
        'videos',
        `output-${Date.now()}.mp4`
      );

      const filePathnames = FileManager.getFilesByPathnames(
        screenshots.map(({ pathname }) => pathname)
      );

      if (!worker) {
        worker = new Worker(
          join(
            __dirname,
            'assets',
            'workers',
            'convert-screenshots-to-video.worker.js'
          ),
          { workerData: { filePathnames, outputPath, config } }
        );
        worker.postMessage({ command: 'start' });
      }

      worker.on(
        'message',
        (evt: { status: string; message: string | number }) => {
          if (evt.status === 'progress') {
            event.reply(channel.CONVERSION_IN_PROGRESS, evt.message);
          }
          if (evt.status === 'done') {
            event.reply(
              channel.SCREESHOTS_CONVERTED,
              FileManager.encodePath(String(evt.message))
            );
          }

          if (evt.status === 'error') {
            event.reply(channel.GENERATION_ERROR, evt.message);
          }
        }
      );

      worker.on('error', (code: number) => {
        if (code !== 0) {
          event.reply(
            channel.GENERATION_ERROR,
            'An Error Occurred while video generation'
          );
          worker.terminate();
        }
        console.error(code);
      });

      worker.on('exit', (error: any) => {
        if (worker) {
          event.reply(channel.GENERATION_ERROR, error);
          worker.terminate();
          worker = null;
        }
        console.error(error);
      });
    }
  );

  ipcMain.on(channel.CANCEL_GENERATING, () => {
    if (worker) {
      worker.terminate();
      worker = null;
    }
  });
}

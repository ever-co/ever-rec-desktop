import { ScreenshotService } from '@prototype/electron/database';
import { FileManager } from '@prototype/electron/utils';
import { IVideoConvertPayload, channel } from '@prototype/shared/utils';
import { ipcMain } from 'electron';
import { join } from 'path';
import { In } from 'typeorm';
import { Worker } from 'worker_threads';

export function convertScreenshotsToVideoEvent() {
  ipcMain.on(
    channel.START_CONVERT_TO_VIDEO,
    async (event, { screenshotIds, config }: IVideoConvertPayload) => {
      const screenshots = await ScreenshotService.findAll({
        where: { id: In(screenshotIds) },
        order: { createdAt: 'ASC' },
      });

      const filePathnames = FileManager.getFilesByPathnames(
        screenshots.map(({ pathname }) => pathname)
      );
      const batches = splitIntoBatches(filePathnames, config.batch || 100); // Limit to batches of 100
      const batchVideoPaths: string[] = [];
      const workers: Worker[] = [];

      let completedWorkers = 0;

      config.duration = config.duration / filePathnames.length;

      // Function to handle each worker's messages
      function handleWorkerMessages(worker: Worker, index: number) {
        worker.on(
          'message',
          (evt: { status: string; message: string | number }) => {
            if (evt.status === 'progress') {
              event.reply(channel.CONVERSION_IN_PROGRESS, evt.message);
            }

            if (evt.status === 'done') {
              batchVideoPaths.push(evt.message as string);
              completedWorkers++;
              checkCompletion();
            }

            if (evt.status === 'error') {
              event.reply(channel.GENERATION_ERROR, evt.message);
            }
          }
        );

        worker.on('error', (error: any) => {
          console.error(`Worker error in batch ${index}: ${error}`);
          event.reply(
            channel.GENERATION_ERROR,
            error.message || 'An error occurred'
          );
        });

        worker.on('exit', (code: number) => {
          console.log(`Worker for batch ${index} exited with code ${code}`);
          if (code !== 1) {
            event.reply(
              channel.GENERATION_ERROR,
              'Worker exited with an error'
            );
          }
          worker.terminate();
        });
      }

      // Check if all workers are done and proceed to combine videos
      function checkCompletion() {
        if (completedWorkers === batches.length) {
          const finalOutputPath = FileManager.createFilePath(
            'videos',
            `output-${Date.now()}.mp4`
          );

          const worker = new Worker(
            join(__dirname, 'assets', 'workers', 'combine-videos.worker.js'),
            { workerData: { batchVideoPaths, finalOutputPath } }
          );

          worker.postMessage({ command: 'start' });

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
            if (code !== 1) {
              event.reply(
                channel.GENERATION_ERROR,
                'An Error Occurred while video combination'
              );
              worker.terminate();
            }
          });

          worker.on('exit', () => {
            worker.terminate();
          });
        }
      }

      // Start workers in parallel
      batches.forEach((batch, index) => {
        const worker = new Worker(
          join(
            __dirname,
            'assets',
            'workers',
            'convert-screenshots-to-video.worker.js'
          ),
          {
            workerData: {
              filePathnames: batch,
              outputPath: getBatchOutputPath(index),
              config,
            },
          }
        );

        workers.push(worker);
        handleWorkerMessages(worker, index);
        worker.postMessage({ command: 'start' });
      });

      // Handle cancellation
      ipcMain.on(channel.CANCEL_GENERATING, () => {
        workers.forEach((worker) => worker.terminate());
        event.reply(channel.CANCEL_CONVERSION);
      });
    }
  );
}

function splitIntoBatches(arr: string[], batchSize: number): string[][] {
  const batches: string[][] = [];
  for (let i = 0; i < arr.length; i += batchSize) {
    batches.push(arr.slice(i, i + batchSize));
  }
  return batches;
}

function getBatchOutputPath(batchIndex: number): string {
  return FileManager.createFilePath(
    'videos',
    `batch-${batchIndex}-${Date.now()}.mp4`
  );
}

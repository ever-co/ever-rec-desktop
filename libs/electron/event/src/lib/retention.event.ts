import { TimeLogService, VideoService } from '@ever-co/electron-database';
import { ElectronLogger, FileManager } from '@ever-co/electron-utils';
import { Channel, IVideo, moment } from '@ever-co/shared-utils';
import { ipcMain } from 'electron';
import { LessThan } from 'typeorm';

let interval: NodeJS.Timeout | null = null;

export function retentionEvents() {
  const logger = new ElectronLogger('Retention events');
  const timeLogService = new TimeLogService();
  const videoService = new VideoService();

  ipcMain.on(Channel.CLEAN_UP_DATA, async (_, { retention }) => {
    if (retention === -1) {
      return removeRetentionEvents();
    }

    if (interval) {
      clearInterval(interval);
      logger.info('Interval cleared for clean-up events.');
    }

    logger.info('Starting clean-up check every 24 hours.');

    await cleanup(retention);

    interval = setInterval(async () => {
      await cleanup(retention);
    }, moment.duration(1, 'day').asMilliseconds());
  });

  async function cleanup(retention: number) {
    logger.info('Checking time logs for clean-up...');

    const timeLogs = await timeLogService.findAll({
      where: {
        createdAt: LessThan(moment().subtract(retention, 'days').toDate()),
      },
      relations: ['screenshots', 'screenshots.video'],
    });

    if (timeLogs.length === 0) {
      logger.info('No time logs found for cleaning.');
      return;
    }

    logger.info(`Cleaning up ${timeLogs.length} time logs...`);
    const timeLogIds = timeLogs.map(({ id }) => id);
    const screenshotsPathnames = timeLogs.flatMap(({ screenshots }) =>
      screenshots.map(({ pathname }) => pathname)
    );
    const videos = timeLogs
      .flatMap(({ screenshots }) => screenshots.map(({ video }) => video))
      .filter(Boolean) as IVideo[];
    const videoIds = videos.map(({ id }) => id);
    const videoPathnames = videos.map(({ pathname }) => pathname);

    try {
      await Promise.all([
        timeLogService.deleteAll(timeLogIds),
        videoService.deleteAll(videoIds),
        ...screenshotsPathnames.map((pathname) =>
          FileManager.deleteFile(pathname)
        ),
        ...videoPathnames.map((pathname) => FileManager.deleteFile(pathname)),
      ]);
      logger.info('Clean-up completed successfully.');
    } catch (error) {
      logger.error(`Error during clean-up`, error);
    }
  }
}

export function removeRetentionEvents(): void {
  if (interval) {
    clearInterval(interval);
    interval = null;
  }
  ipcMain.removeAllListeners(Channel.CLEAN_UP_DATA);
}

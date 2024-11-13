import {
  ScreenshotService,
  TimelineService,
  TimeLogService,
  VideoService,
} from '@ever-co/electron-database';
import {
  BatchSplitter,
  ElectronLogger,
  FileManager,
  VideoConversionService,
  WorkerFactory,
} from '@ever-co/electron-utils';

import {
  Channel,
  IBatchVideo,
  IScreenshot,
  ITimeLog,
  IVideo,
  IVideoConvertPayload,
} from '@ever-co/shared-utils';
import { ipcMain } from 'electron';
import { ILike, In, IsNull } from 'typeorm';

export function convertScreenshotsToVideoEvent() {
  ipcMain.on(
    Channel.START_CONVERT_TO_VIDEO,
    async (
      event,
      {
        filter,
        config,
        timeLogId,
        screenshotIds = [],
        videoIds = [],
        isTimeLine = false,
      }: IVideoConvertPayload
    ) => {
      const logger = new ElectronLogger('Screenshots --> Video');
      const splitter = new BatchSplitter();
      const videoService = new VideoService();
      const timeLogService = new TimeLogService();
      const timelineService = new TimelineService();

      let timeLog: ITimeLog | null;

      if (timeLogId) {
        timeLog = await timeLogService.findOneById(timeLogId);
      } else {
        timeLog = await timeLogService.running();
      }

      let screenshots: IScreenshot[] = [];
      let videos: IVideo[] = [];

      if (isTimeLine) {
        try {
          const video = await videoService.findOne({
            where: {
              timelines: {
                timeLogId,
              },
            },
          });
          if (!video) {
            const [data, count] = await videoService.findAndCount({
              where: {
                timeLog: {
                  id: timeLogId,
                },
                parent: {
                  id: IsNull(),
                },
              },
            });

            const video = count === 1 ? data[0] : null;

            console.log('Event', count, video);

            if (video) {
              logger.info(
                'Assigning video',
                video.id,
                'to timeline',
                timeLogId
              );
              await timelineService.save({
                videoId: video.id,
                timeLogId,
              });
            }
          }

          if (video) {
            logger.info('Timeline video found');
            event.reply(Channel.SCREESHOTS_CONVERTED, video);
            return;
          } else {
            logger.info('Timeline video not found');
          }
        } catch (error) {
          logger.error('Error finding timeline video:', error);
          return event.reply(
            Channel.CANCEL_CONVERSION,
            'Error finding timeline video'
          );
        }
      }

      if (screenshotIds.length === 0 && videoIds.length === 0 && !isTimeLine) {
        screenshots = await ScreenshotService.findAll({
          where: {
            ...(filter && {
              metadata: {
                description: ILike(`%${filter}%`),
              },
            }),
            ...(timeLog && {
              timeLog: {
                id: timeLog.id,
              },
            }),
            ...(config.optimized && {
              video: {
                id: IsNull(),
              },
            }),
          },
          order: { createdAt: 'ASC' },
        });
      } else if (videoIds.length === 0 && !isTimeLine) {
        screenshots = await ScreenshotService.findAll({
          where: {
            id: In(screenshotIds),
          },
          order: { createdAt: 'ASC' },
        });
      }

      if (videoIds.length > 0) {
        videos = await videoService.findAll({
          relations: ['screenshots'],
          where: {
            id: In(videoIds),
          },
          order: { createdAt: 'ASC' },
        });
      }

      if (isTimeLine) {
        videos = await videoService.findAll({
          relations: ['screenshots'],
          where: {
            timeLog: {
              id: timeLogId,
            },
            parent: {
              id: IsNull(),
            },
          },
          order: { createdAt: 'ASC' },
        });
        if (videos.length === 0) {
          screenshots = await ScreenshotService.findAll({
            where: {
              timeLog: {
                id: timeLogId,
              },
            },
            order: { createdAt: 'ASC' },
          });
        }
      }

      const screenshotsSize = screenshots.length;
      const videosSize = videos.length;

      if (screenshotsSize === 0) {
        logger.info('No screenshots found to convert.');
        if (videosSize === 0) {
          logger.info('No videos found to merge.');
          return event.reply(
            Channel.CANCEL_CONVERSION,
            'We cannot proceed to conversion. No screenshots or videos found.'
          );
        }
      } else {
        logger.info(`Find ${screenshotsSize} screenshots to convert`);
      }

      if (videosSize) {
        logger.info(`Find ${videosSize} videos to merge`);
      }

      const videoConversionService = new VideoConversionService(
        event,
        screenshots,
        { ...config, timeLogId },
        splitter,
        WorkerFactory,
        FileManager,
        Channel,
        logger,
        videoService,
        timelineService
      );

      if (screenshotsSize > 0) {
        await videoConversionService.convert();
      }

      if (videosSize > 0) {
        const batches: IBatchVideo[] = videos.map((video, index) => ({
          path: FileManager.decodePath(video.pathname),
          index,
        }));

        await videoConversionService.combineVideos(batches, videos, isTimeLine);
      }
    }
  );
}

export function removeConvertScreenshotsToVideoEvent(): void {
  ipcMain.removeAllListeners(Channel.START_CONVERT_TO_VIDEO);
}

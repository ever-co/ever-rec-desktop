import { VideoService } from '@ever-co/electron-database';
import { Channel, IPaginationOptions } from '@ever-co/shared-utils';
import { ipcMain } from 'electron';
import { IsNull, Not } from 'typeorm';

export function crudVideoEvents() {
  const videoService = new VideoService();
  // Get all screenshots
  ipcMain.handle(
    Channel.REQUEST_RECENT_VIDEOS,
    async (_, options = {} as IPaginationOptions) => {
      const { page = 1, limit = 10 } = options;

      const [data, count] = await videoService.findAndCount({
        where: {
          chunks: {
            id: Not(IsNull())
          }
        },
        order: { createdAt: 'DESC' },
        relations: ['metadata', 'chunks'],
        skip: (page - 1) * limit,
        take: limit,
      });
      const hasNext = page * limit < count;

      return { data, count, hasNext };
    }
  );

  // Get one video
  ipcMain.handle(Channel.REQUEST_ONE_VIDEO, async (_, options = {}) => {
    return videoService.findOne(options);
  });
}

// Removes any handler for channels, if present.
export function removeCrudVideoEvent(): void {
  const channels = [Channel.REQUEST_RECENT_VIDEOS, Channel.REQUEST_ONE_VIDEO];
  channels.forEach((channel) => ipcMain.removeHandler(channel));
}

import { MetadataService, VideoService } from '@ever-co/electron-database';
import { FileManager } from '@ever-co/electron-utils';
import { Channel, IPaginationOptions, IVideo } from '@ever-co/shared-utils';
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
            id: Not(IsNull()),
          },
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

  // Get one video
  ipcMain.handle(Channel.REQUEST_DELETE_ONE_VIDEO, async (_, video: IVideo) => {
    await videoService.delete(video.id);
    await FileManager.deleteFile(video.pathname);
  });

  // Get one video
  ipcMain.handle(Channel.GET_USED_SIZE, () => {
    const metadataService = new MetadataService();
    return metadataService.getUsedSize();
  });
}

// Removes any handler for channels, if present.
export function removeCrudVideoEvent(): void {
  const channels = [
    Channel.REQUEST_RECENT_VIDEOS,
    Channel.REQUEST_ONE_VIDEO,
    Channel.GET_USED_SIZE,
  ];
  channels.forEach((channel) => ipcMain.removeHandler(channel));
}

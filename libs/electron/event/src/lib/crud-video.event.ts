import {
  MetadataService,
  VideoMetadataService,
  VideoService,
} from '@ever-co/electron-database';
import { FileManager } from '@ever-co/electron-utils';
import {
  Channel,
  currentDay,
  IPaginationOptions,
  IVideo
} from '@ever-co/shared-utils';
import { ipcMain } from 'electron';
import { Between, IsNull, Not } from 'typeorm';

export function crudVideoEvents() {
  const videoService = new VideoService();
  const metadataService = new VideoMetadataService();
  // Get all screenshots
  ipcMain.handle(
    Channel.REQUEST_RECENT_VIDEOS,
    async (_, options = {} as IPaginationOptions<IVideo>) => {
      const {
        page = 1,
        limit = 10,
        start = currentDay().start,
        end = currentDay().end,
      } = options;

      const [data, count] = await videoService.findAndCount({
        where: {
          createdAt: Between(start, end),
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

  // Delete one video
  ipcMain.handle(Channel.REQUEST_DELETE_ONE_VIDEO, async (_, video: IVideo) => {
    await videoService.delete(video.id);
    await FileManager.deleteFile(video.pathname);
  });

  // Delete Many Videos
  ipcMain.handle(Channel.REQUEST_DELETE_ALL_VIDEO, async (_, videos: IVideo[]) => {
    // Extract IDs
    const ids = videos.map(({ id }) => id);

    // Extract Pathnames
    const pathnames = videos.map(({ pathname }) => pathname);

    // Delete videos in the database
    await videoService.deleteAll(ids);

    // Delete files concurrently
    await Promise.all(
      pathnames.map(async (pathname) => await FileManager.deleteFile(pathname))
    );
  });

  // Get one video
  ipcMain.handle(Channel.GET_USED_SIZE, () => {
    const metadataService = new MetadataService();
    return metadataService.getUsedSize();
  });

  // Update video metadata
  ipcMain.handle(
    Channel.REQUEST_VIDEO_METADATA_UPDATE,
    async (_, video: IVideo) => {
      const { metadata } = video;
      if (!metadata) throw Error("We can't update this video");
      video.metadata = await metadataService.update(metadata.id, metadata);
      return video;
    }
  );
}

// Removes any handler for channels, if present.
export function removeCrudVideoEvent(): void {
  const channels = [
    Channel.REQUEST_RECENT_VIDEOS,
    Channel.REQUEST_ONE_VIDEO,
    Channel.GET_USED_SIZE,
    Channel.REQUEST_VIDEO_METADATA_UPDATE,
  ];
  channels.forEach((channel) => ipcMain.removeHandler(channel));
}

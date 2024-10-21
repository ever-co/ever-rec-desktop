import { VideoService } from '@ever-co/electron-database';
import { Channel, IPaginationOptions } from '@ever-co/shared-utils';
import { ipcMain } from 'electron';

export function crudVideoEvents() {
  const videoService = new VideoService();
  // Get all screenshots
  ipcMain.handle(
    Channel.REQUEST_VIDEO,
    async (_, options = {} as IPaginationOptions) => {
      const { page = 1, limit = 10 } = options;

      const [data, count] = await videoService.findAndCount({
        order: { createdAt: 'ASC' },
        relations: ['metadata'],
        skip: (page - 1) * limit,
        take: limit,
      });
      const hasNext = page * limit < count;

      return { data, count, hasNext };
    }
  );
}

// Removes any handler for channels, if present.
export function removeCrudVideoEvent(): void {
  const channels = [Channel.REQUEST_VIDEO];
  channels.forEach((channel) => ipcMain.removeHandler(channel));
}

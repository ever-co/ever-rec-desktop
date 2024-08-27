import {
  ChunkService,
  ScreenshotMetadataService,
  ScreenshotService,
  VideoMetadataService,
  VideoService,
} from '@ever-capture/electron-database';
import { FileManager } from '@ever-capture/electron-utils';
import { Channel } from '@ever-capture/shared-utils';
import { ipcMain } from 'electron';

export function crudScreeshotEvents() {
  // Get all screenshots
  ipcMain.handle(Channel.REQUEST_SCREENSHOTS, () => {
    return ScreenshotService.findAllWithMetadata();
  });

  // searching
  ipcMain.handle(Channel.SEARCHING, (_, request: string) => {
    return ScreenshotService.findScreenshotsByDescription(request);
  });

  ipcMain.handle(Channel.REQUEST_PURGE, async () => {
    const videoService = new VideoService();
    const chunkService = new ChunkService();
    const videoMetadata = new VideoMetadataService();

    await ScreenshotMetadataService.deleteAll();
    await ScreenshotService.deleteAll();

    await videoMetadata.deleteAll();
    await videoService.deleteAll();

    await chunkService.deleteAll();

    await FileManager.removeAllFiles('screenshots');
    await FileManager.removeAllFiles('videos');
  });
}

// Removes any handler for channels, if present.
export function removeCrudScreenshotEvent(): void {
  const channels = [
    Channel.REQUEST_SCREENSHOTS,
    Channel.SEARCHING,
    Channel.REQUEST_DELETE_ALL_SCREENSHOTS,
    Channel.REQUEST_PURGE,
  ];
  channels.forEach((channel) => ipcMain.removeHandler(channel));
}

import {
  screenshotMetadataTable,
  ScreenshotService,
} from '@ever-capture/electron-database';
import { FileManager } from '@ever-capture/electron-utils';
import { Channel } from '@ever-capture/shared-utils';
import { ipcMain } from 'electron';

export function crudScreeshotEvents() {
  // Get all screenshots
  ipcMain.handle(Channel.REQUEST_SCREENSHOTS, () => {
    return ScreenshotService.findAll({
      order: { createdAt: 'ASC' },
      relations: [screenshotMetadataTable],
    });
  });

  // searching
  ipcMain.handle(Channel.SEARCHING, (_, request: string) => {
    return ScreenshotService.findAll({
      relations: [screenshotMetadataTable],
      where: {
        [`${screenshotMetadataTable}.description`]: request,
      },
      order: { createdAt: 'ASC' },
    });
  });

  // Delete all screenshots
  ipcMain.handle(Channel.REQUEST_DELETE_ALL_SCREENSHOTS, async () => {
    await ScreenshotService.deleteAll();
    await FileManager.removeAllFiles('screenshots');
  });
}

// Removes any handler for channels, if present.
export function removeCrudScreenshotEvent(): void {
  const channels = [
    Channel.REQUEST_SCREENSHOTS,
    Channel.SEARCHING,
    Channel.REQUEST_DELETE_ALL_SCREENSHOTS,
  ];
  channels.forEach((channel) => ipcMain.removeHandler(channel));
}

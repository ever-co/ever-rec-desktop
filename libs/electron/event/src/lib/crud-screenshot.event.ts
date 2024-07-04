import { ScreenshotService } from '@prototype/electron/database';
import { FileManager } from '@prototype/electron/utils';
import { channel } from '@prototype/shared/utils';
import { ipcMain } from 'electron';

export function crudScreeshotEvents() {
  // Get all screenshots
  ipcMain.handle(channel.REQUEST_SCREENSHOTS, () => {
    return ScreenshotService.findAll({ order: { createdAt: 'ASC' } });
  });
  // Delete all screenshots
  ipcMain.handle(channel.REQUEST_DELETE_ALL_SCREENSHOTS, async () => {
    await ScreenshotService.deleteAll();
    FileManager.removeAllFiles('screenshots');
  });
}

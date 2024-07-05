import { ScreenshotService } from '@prototype/electron/database';
import { FileManager } from '@prototype/electron/utils';
import { Channel } from '@prototype/shared/utils';
import { ipcMain } from 'electron';

export function crudScreeshotEvents() {
  // Get all screenshots
  ipcMain.handle(Channel.REQUEST_SCREENSHOTS, () => {
    return ScreenshotService.findAll({
      order: { createdAt: 'ASC' },
      relations: ['metadata'],
    });
  });
  // Delete all screenshots
  ipcMain.handle(Channel.REQUEST_DELETE_ALL_SCREENSHOTS, async () => {
    await ScreenshotService.deleteAll();
    FileManager.removeAllFiles('screenshots');
  });
}

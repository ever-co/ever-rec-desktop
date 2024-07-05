import { ScreenshotService } from '@prototype/electron/database';
import { FileManager } from '@prototype/electron/utils';
import { Channel } from '@prototype/shared/utils';
import { ipcMain } from 'electron';
import { ILike } from 'typeorm';

export function crudScreeshotEvents() {
  // Get all screenshots
  ipcMain.handle(Channel.REQUEST_SCREENSHOTS, () => {
    return ScreenshotService.findAll({
      order: { createdAt: 'ASC' },
      relations: ['metadata'],
    });
  });

  // searching
  ipcMain.handle(Channel.SEARCHING, (_, request: string) => {
    return ScreenshotService.findAll({
      relations: ['metadata'],
      where: {
        metadata: {
          description: ILike(`%${request}%`),
        },
      },
      order: { createdAt: 'ASC' },
    });
  });

  // Delete all screenshots
  ipcMain.handle(Channel.REQUEST_DELETE_ALL_SCREENSHOTS, async () => {
    await ScreenshotService.deleteAll();
    FileManager.removeAllFiles('screenshots');
  });
}

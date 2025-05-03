import { KeytarService } from '@ever-co/electron-utils';
import { Channel } from '@ever-co/shared-utils';
import { app, ipcMain } from 'electron';

export function MainEvents() {
  ipcMain.on(Channel.UPDATE_ICON_BADGE, (_, count: number) => {
    app.setBadgeCount(Math.max(count, 0));
  });

  ipcMain.handle(Channel.GET_PASSWORD, (_, account: string) => {
    return KeytarService.getPassword(account);
  });

  ipcMain.handle(Channel.DELETE_PASSWORD, (_, account: string) => {
    return KeytarService.deletePassword(account);
  });

  ipcMain.handle(
    Channel.SET_PASSWORD,
    (_, { account, password }: { account: string; password: string }) => {
      return KeytarService.setPassword(account, password);
    }
  );
}

export function removeMainEvents(): void {
  [Channel.UPDATE_ICON_BADGE].forEach((channel) =>
    ipcMain.removeAllListeners(channel)
  );

  [
    Channel.GET_PASSWORD,
    Channel.DELETE_PASSWORD,
    Channel.SET_PASSWORD,
    '__ELECTRON_LOG__',
  ].forEach((channel) => ipcMain.removeHandler(channel));
}

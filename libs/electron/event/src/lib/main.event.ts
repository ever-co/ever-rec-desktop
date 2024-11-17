import { ActivityHandler, KeytarService } from '@ever-co/electron-utils';
import { Channel } from '@ever-co/shared-utils';
import { app, ipcMain } from 'electron';

export function MainEvents() {
  const activityHandler = new ActivityHandler();

  activityHandler.onChange((state) => {
    console.log('state', state);
  });

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
  ipcMain.removeAllListeners(Channel.UPDATE_ICON_BADGE);

  [Channel.GET_PASSWORD, Channel.DELETE_PASSWORD, Channel.SET_PASSWORD].forEach(
    (channel) => ipcMain.removeHandler(channel)
  );
}

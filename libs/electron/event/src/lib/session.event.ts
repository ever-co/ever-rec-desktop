import { Channel } from "@ever-co/shared-utils";
import { ipcMain } from "electron/main";
import { IUser } from '@ever-co/shared-utils';
import { UserSessionService } from "@ever-co/electron-database";

export const userSessionService = new UserSessionService();

export function sessionEvents(): void {
  ipcMain.on(Channel.LOGIN, (_, user: IUser) => userSessionService.login(user));

  ipcMain.on(Channel.LOGOUT, () => userSessionService.logout());
}

export function removeSessionEvents(): void {
  [Channel.LOGIN, Channel.LOGOUT].forEach(
    channel => ipcMain.removeAllListeners(channel)
  )
}

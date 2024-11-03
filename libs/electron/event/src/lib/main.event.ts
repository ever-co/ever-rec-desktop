import { Channel } from "@ever-co/shared-utils";
import { app, ipcMain } from "electron";

export function MainEvents () {
  ipcMain.on(Channel.UPDATE_ICON_BADGE, (_, count: number) => {
    app.setBadgeCount(Math.max(count, 0));
  });
}

export function removeMainEvents(): void {
  ipcMain.removeAllListeners(Channel.UPDATE_ICON_BADGE);
}

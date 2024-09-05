import { Channel } from '@ever-co/shared-utils';
import { BrowserWindow } from 'electron';

export class EventManager {
  private static instance: EventManager;

  public static getInstance(): EventManager {
    if (!this.instance) {
      this.instance = new EventManager();
    }
    return this.instance;
  }

  public reply(channel: Channel, ...args: any[]) {
    BrowserWindow.getAllWindows().forEach((window) => {
      window.webContents.send(channel, ...args);
    });
  }
}

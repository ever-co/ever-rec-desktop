import { DOCUMENT } from '@angular/common';
import { Injectable, inject } from '@angular/core';
import { Channel } from '@ever-co/shared-utils';

@Injectable({
  providedIn: 'root',
})
export class ElectronService {
  private readonly document = inject(DOCUMENT);

  private get window(): Window | any {
    const win = this.document.defaultView;
    if (!win) {
      console.debug('[ElectronService]: No window available');
      return null;
    }
    return win;
  }

  private get electronAPI() {
    if (!this.window?.electronAPI) {
      console.debug('[ElectronService]: Electron API is unavailable');
      return null;
    }
    return this.window.electronAPI;
  }

  public async invoke<T, U>(channel: Channel, data?: T): Promise<U> {
    if (this.electronAPI) {
      return this.electronAPI.invoke(channel, data) as U;
    }
    throw new Error('Electron API is not available');
  }

  public on(
    channel: Channel,
    callback: (event: any, ...args: any[]) => void
  ): void {
    if (this.electronAPI) {
      this.electronAPI.on(channel, (event: any, ...args: any[]) => {
        callback(event, ...args);
        return () => this.removeAllListeners(channel);
      });
    } else {
      throw new Error('Electron API is not available');
    }
  }

  public once(
    channel: Channel,
    callback: (event: any, ...args: any[]) => void
  ): void {
    if (this.electronAPI) {
      this.electronAPI.once(channel, callback);
    } else {
      throw new Error('Electron API is not available');
    }
  }

  public send(channel: Channel, data?: any): void {
    if (this.electronAPI) {
      this.electronAPI.removeAllListeners(channel);
      this.electronAPI.send(channel, data);
    } else {
      throw new Error('Electron API is not available');
    }
  }

  public removeAllListeners(channel: Channel): void {
    if (this.electronAPI) {
      this.electronAPI.removeAllListeners(channel);
    } else {
      throw new Error('Electron API is not available');
    }
  }

  public removeListener(
    channel: Channel,
    callback: (event: any, ...args: any[]) => void
  ): void {
    if (this.electronAPI) {
      this.electronAPI.removeListener(channel, callback);
    } else {
      throw new Error('Electron API is not available');
    }
  }
}

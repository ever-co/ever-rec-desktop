import { DOCUMENT } from '@angular/common';
import { Injectable, inject } from '@angular/core';
import { channel as ChEnum } from '@prototype/shared/utils';

@Injectable({
  providedIn: 'root',
})
export class ElectronService {
  private readonly document = inject(DOCUMENT);

  private get window(): Window | null {
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

  public async invoke<T, U>(channel: ChEnum, data?: T): Promise<U> {
    if (this.electronAPI) {
      return this.electronAPI.invoke(channel, data) as U;
    }
    throw new Error('Electron API is not available');
  }

  public on(
    channel: ChEnum,
    callback: (event: any, ...args: any[]) => void
  ): void {
    if (this.electronAPI) {
      this.electronAPI.on(channel, callback);
    } else {
      throw new Error('Electron API is not available');
    }
  }

  public once(
    channel: ChEnum,
    callback: (event: any, ...args: any[]) => void
  ): void {
    if (this.electronAPI) {
      this.electronAPI.once(channel, callback);
    } else {
      throw new Error('Electron API is not available');
    }
  }

  public send(channel: ChEnum, data?: any): void {
    if (this.electronAPI) {
      this.electronAPI.send(channel, data);
    } else {
      throw new Error('Electron API is not available');
    }
  }

  public removeAllListeners(channel: ChEnum): void {
    if (this.electronAPI) {
      this.electronAPI.removeAllListeners(channel);
    } else {
      throw new Error('Electron API is not available');
    }
  }

  public removeListener(
    channel: ChEnum,
    callback: (event: any, ...args: any[]) => void
  ): void {
    if (this.electronAPI) {
      this.electronAPI.removeListener(channel, callback);
    } else {
      throw new Error('Electron API is not available');
    }
  }
}

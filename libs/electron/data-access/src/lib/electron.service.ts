import { DOCUMENT } from '@angular/common';
import { Injectable, inject } from '@angular/core';

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

  private get electronAPI(): any | null {
    if (!this.window?.electronAPI) {
      console.debug('[ElectronService]: Electron API is unavailable');
      return null;
    }
    return this.window.electronAPI;
  }

  public captureScreen(delay: number): void {
    const api = this.electronAPI;
    if (!api) return;

    try {
      api.captureScreen(delay);
    } catch (error) {
      console.error('[ElectronService]: Error capturing screen', error);
    }
  }

  public onScreenshotCaptured(callback: (image: string) => void): void {
    const api = this.electronAPI;
    if (!api) return;

    try {
      api.onScreenshotCaptured((_: unknown, image: string) => callback(image));
    } catch (error) {
      console.error(
        '[ElectronService]: Error setting screenshot capture callback',
        error
      );
    }
  }
}

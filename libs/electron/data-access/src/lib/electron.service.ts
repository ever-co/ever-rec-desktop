import { DOCUMENT } from '@angular/common';
import { Injectable, inject } from '@angular/core';
import { IScreenshot } from '@prototype/shared/utils';

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

  public startCapture(delay: number): void {
    const api = this.electronAPI;
    if (!api) return;

    try {
      api.startCapture(delay);
    } catch (error) {
      console.error('[ElectronService]: Error capturing screen', error);
    }
  }

  public stopCapture(): void {
    const api = this.electronAPI;
    if (!api) return;

    try {
      api.stopCapture();
    } catch (error) {
      console.error('[ElectronService]: Error capturing screen', error);
    }
  }

  public onScreenshotCaptured(
    callback: (screenshot: IScreenshot) => void
  ): void {
    const api = this.electronAPI;
    if (!api) return;

    try {
      api.onScreenshotCaptured((_: unknown, screenshot: IScreenshot) =>
        callback(screenshot)
      );
    } catch (error) {
      console.error(
        '[ElectronService]: Error setting screenshot capture callback',
        error
      );
    }
  }
}

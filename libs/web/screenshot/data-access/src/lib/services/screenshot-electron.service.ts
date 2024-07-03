import { Injectable, inject } from '@angular/core';
import { ElectronService } from '@prototype/electron/data-access';
import { IScreenshot, channel } from '@prototype/shared/utils';

@Injectable({
  providedIn: 'root',
})
export class ScreenshotElectronService {
  private electronService = inject(ElectronService);

  public onScreenshotCaptured(callback: (screenshot: IScreenshot) => void) {
    this.electronService.on(
      channel.SCREENSHOT_CAPTURED,
      (_, screenshot: IScreenshot) => callback(screenshot)
    );
  }

  public stopCapture() {
    this.electronService.send(channel.STOP_CAPTURE_SCREEN);
  }

  public startCapture(interval: number): void {
    this.electronService.send(channel.START_CAPTURE_SCREEN, interval);
  }
}

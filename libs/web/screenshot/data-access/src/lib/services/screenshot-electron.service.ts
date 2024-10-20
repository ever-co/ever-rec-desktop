import { Injectable, inject } from '@angular/core';
import { ElectronService } from '@ever-co/electron-data-access';
import { Channel, IPaginationOptions, IPaginationResponse, IScreenCaptureConfig, IScreenshot } from '@ever-co/shared-utils';

@Injectable({
  providedIn: 'root',
})
export class ScreenshotElectronService {
  private electronService = inject(ElectronService);

  public onScreenshotCaptured(callback: (screenshot: IScreenshot) => void) {
    this.electronService.on(
      Channel.SCREENSHOT_CAPTURED,
      (_, screenshot: IScreenshot) => callback(screenshot)
    );
  }

  public stopCapture() {
    this.electronService.send(Channel.STOP_CAPTURE_SCREEN);
  }

  public startCapture(config: IScreenCaptureConfig): void {
    this.electronService.send(Channel.START_CAPTURE_SCREEN, config);
  }

  public getAllScreenshots(options: IPaginationOptions): Promise<IPaginationResponse<IScreenshot>> {
    return this.electronService.invoke(Channel.REQUEST_SCREENSHOTS, options);
  }

  public deleteAllScreenshots(): Promise<void> {
    return this.electronService.invoke(Channel.REQUEST_PURGE);
  }

  public askFor(options: IPaginationOptions): Promise<IPaginationResponse<IScreenshot>> {
    return this.electronService.invoke(Channel.SEARCHING, options);
  }
}

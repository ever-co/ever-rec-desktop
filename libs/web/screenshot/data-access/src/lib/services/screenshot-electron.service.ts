import { Injectable, inject } from '@angular/core';
import { ElectronService } from '@ever-capture/electron/data-access';
import { Channel, IScreenshot } from '@ever-capture/shared/utils';

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

  public startCapture(interval: number): void {
    this.electronService.send(Channel.START_CAPTURE_SCREEN, interval);
  }

  public getAllScreenshots(): Promise<IScreenshot[]> {
    return this.electronService.invoke(Channel.REQUEST_SCREENSHOTS);
  }

  public deleteAllScreenshots(): Promise<void> {
    return this.electronService.invoke(Channel.REQUEST_DELETE_ALL_SCREENSHOTS);
  }

  public askFor(request: string): Promise<IScreenshot[]> {
    console.log(request)
    return this.electronService.invoke(Channel.SEARCHING, request);
  }
}

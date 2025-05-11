import { Injectable, inject } from '@angular/core';
import { ElectronService } from '@ever-co/electron-data-access';
import {
  Channel,
  IPaginationOptions,
  IPaginationResponse,
  IScreenCaptureConfig,
  IScreenshot,
  IScreenshotChartLine,
  IScreenshotMetadataStatistic,
  IUploadDone,
  TimeSlot,
} from '@ever-co/shared-utils';
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root',
})
export class ScreenshotElectronService {
  private electronService = inject(ElectronService);

  public onScreenshotCaptured(callback: (screenshot: IScreenshot) => void) {
    this.electronService.removeAllListeners(Channel.SCREENSHOT_CAPTURED);
    this.electronService.on(
      Channel.SCREENSHOT_CAPTURED,
      (_, screenshot: IScreenshot) => callback(screenshot),
    );
  }

  public stopCapture() {
    this.electronService.send(Channel.STOP_CAPTURE_SCREEN);
  }

  public startCapture(config: IScreenCaptureConfig): void {
    this.electronService.send(Channel.START_CAPTURE_SCREEN, config);
  }

  public getAllScreenshots(
    options: IPaginationOptions<IScreenshot>,
  ): Promise<IPaginationResponse<IScreenshot>> {
    return this.electronService.invoke(Channel.REQUEST_SCREENSHOTS, options);
  }

  public getOneScreenshot<T>(options: T): Promise<IScreenshot> {
    return this.electronService.invoke(Channel.REQUEST_ONE_SCREENSHOT, options);
  }

  public deleteAllData(): Promise<void> {
    return this.electronService.invoke(Channel.REQUEST_PURGE);
  }

  public deleteScreenshot(screenshot: IScreenshot): Promise<void> {
    return this.electronService.invoke(
      Channel.REQUEST_DELETE_ONE_SCREENSHOT,
      screenshot,
    );
  }

  public askFor(
    options: IPaginationOptions<IScreenshot>,
  ): Promise<IPaginationResponse<IScreenshot>> {
    return this.electronService.invoke(Channel.SEARCHING, options);
  }

  public getStatistics(
    options = {} as IPaginationOptions<IScreenshotMetadataStatistic>,
  ): Promise<IPaginationResponse<IScreenshotMetadataStatistic>> {
    return this.electronService.invoke(
      Channel.REQUEST_SCREENSHOTS_STATISTICS,
      options,
    );
  }

  public deleteSelectedScreenshots(screenshots: IScreenshot[]): Promise<void> {
    return this.electronService.invoke(
      Channel.REQUEST_DELETE_SELECTED_SCREENSHOTS,
      screenshots,
    );
  }

  public getScreenshotsChartLine(
    timeslot = 'minute' as TimeSlot,
  ): Promise<IScreenshotChartLine[]> {
    return this.electronService.invoke(Channel.CHART_LINE_DATA, timeslot);
  }

  public onUploadScreenshot(): Observable<IUploadDone> {
    return this.electronService.fromEvent<IUploadDone>(Channel.UPLOAD_DONE);
  }
}

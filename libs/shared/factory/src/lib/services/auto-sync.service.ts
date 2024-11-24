import { Injectable } from '@angular/core';
import { ElectronService } from '@ever-co/electron-data-access';
import { ScreenshotElectronService } from '@ever-co/screenshot-data-access';
import { Channel, IScreenshot } from '@ever-co/shared-utils';
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root',
})
export class AutoSyncService {
  constructor(
    private readonly electronService: ElectronService,
    private readonly screenshotService: ScreenshotElectronService
  ) {}

  public onAutoStartSync(): Observable<void> {
    this.electronService.removeAllListeners(Channel.AUTO_START_SYNC);
    return new Observable<void>((observer) => {
      this.electronService.on(Channel.AUTO_START_SYNC, () => {
        observer.next();
      });
    });
  }

  public onAutoStopSync(): Observable<void> {
    this.electronService.removeAllListeners(Channel.AUTO_STOP_SYNC);
    return new Observable<void>((observer) => {
      this.electronService.on(Channel.AUTO_STOP_SYNC, () => {
        observer.next();
      });
    });
  }

  public onAutoSync(): Observable<IScreenshot> {
    return new Observable<IScreenshot>((observer) =>
      this.screenshotService.onScreenshotCaptured((screenshot) =>
        observer.next(screenshot)
      )
    );
  }
}

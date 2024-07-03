import { Injectable, inject } from '@angular/core';
import { ElectronService } from '@prototype/electron/data-access';
import { channel } from '@prototype/shared/utils';

@Injectable({
  providedIn: 'root',
})
export class ConvertVideoElectronService {
  private readonly electronService = inject(ElectronService);

  public startGenerate(screenshotIds: string[]): void {
    this.electronService.send(channel.START_CONVERT_TO_VIDEO, screenshotIds);
  }

  public cancelGenerate(): void {
    this.electronService.send(channel.CANCEL_GENERATING);
  }

  public onProgress(callback: (progress: number) => void): void {
    this.electronService.on(
      channel.CONVERSION_IN_PROGRESS,
      (_, progress: number) => callback(progress)
    );
  }

  public onDone(callback: (pathname: string) => void): void {
    this.electronService.on(
      channel.SCREESHOTS_CONVERTED,
      (_, pathname: string) => callback(pathname)
    );
  }

  public onError(callback: (error: string) => void): void {
    this.electronService.on(channel.GENERATION_ERROR, (_, error: string) =>
      callback(error)
    );
  }
}

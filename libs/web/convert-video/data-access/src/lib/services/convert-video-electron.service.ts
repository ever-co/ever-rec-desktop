import { Injectable, inject } from '@angular/core';
import { ElectronService } from '@prototype/electron/data-access';
import { Channel, IVideoConvertPayload } from '@prototype/shared/utils';

@Injectable({
  providedIn: 'root',
})
export class ConvertVideoElectronService {
  private readonly electronService = inject(ElectronService);

  public startGenerate(payload: IVideoConvertPayload): void {
    this.electronService.send(Channel.START_CONVERT_TO_VIDEO, payload);
  }

  public cancelGenerate(): void {
    this.electronService.send(Channel.CANCEL_GENERATING);
  }

  public onProgress(callback: (progress: number) => void): void {
    this.electronService.on(
      Channel.CONVERSION_IN_PROGRESS,
      (_, progress: number) => callback(progress)
    );
  }

  public onDone(callback: (pathname: string) => void): void {
    this.electronService.on(
      Channel.SCREESHOTS_CONVERTED,
      (_, pathname: string) => callback(pathname)
    );
  }

  public onError(callback: (error: string) => void): void {
    this.electronService.on(Channel.GENERATION_ERROR, (_, error: string) =>
      callback(error)
    );
  }
}

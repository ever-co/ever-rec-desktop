import { Injectable, inject } from '@angular/core';
import { ElectronService } from '@ever-co/electron-data-access';
import {
  Channel,
  IVideo,
  IVideoConfig,
  IVideoConvertPayload,
} from '@ever-co/shared-utils';

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

  public onDone(callback: (video: IVideo) => void): void {
    this.electronService.on(Channel.SCREESHOTS_CONVERTED, (_, video: IVideo) =>
      callback(video)
    );
  }

  public onError(callback: (error: string) => void): void {
    this.electronService.on(Channel.GENERATION_ERROR, (_, error: string) =>
      callback(error)
    );
  }

  public onAutoGenerate(
    callback: (trigger: { completed: boolean; timeLogId: string }) => void
  ): void {
    this.electronService.on(
      Channel.AUTO_VIDEO_GENERATE,
      (_, { completed = false, timeLogId = null }) =>
        callback({ completed, timeLogId })
    );
  }

  public autoGenerate(config: Partial<IVideoConfig>): void {
    this.electronService.send(Channel.AUTO_VIDEO_GENERATE, config);
  }
}

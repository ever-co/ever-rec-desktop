import { Injectable, inject } from '@angular/core';
import { ElectronService } from '@ever-co/electron-data-access';
import { Channel, IPaginationOptions, IPaginationResponse, IVideo, IVideoConvertPayload } from '@ever-co/shared-utils';

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
    this.electronService.on(
      Channel.SCREESHOTS_CONVERTED,
      (_, video: IVideo) => callback(video)
    );
  }

  public getAllVideos(options: IPaginationOptions): Promise<IPaginationResponse<IVideo>> {
    return this.electronService.invoke(Channel.REQUEST_RECENT_VIDEOS, options);
  }

  public getOneVideo<T>(options: T): Promise<IVideo> {
    return this.electronService.invoke(Channel.REQUEST_ONE_VIDEO, options);
  }

  public onError(callback: (error: string) => void): void {
    this.electronService.on(Channel.GENERATION_ERROR, (_, error: string) =>
      callback(error)
    );
  }
}

import { Injectable, inject } from '@angular/core';
import { ElectronService } from '@ever-co/electron-data-access';
import {
  Channel,
  IPaginationResponse,
  IUploadDone,
  IVideo,
} from '@ever-co/shared-utils';
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root',
})
export class VideoService {
  private readonly electronService = inject(ElectronService);

  public getAllVideos(options = {}): Promise<IPaginationResponse<IVideo>> {
    return this.electronService.invoke(Channel.REQUEST_RECENT_VIDEOS, options);
  }

  public getOneVideo<T>(options: T): Promise<IVideo> {
    return this.electronService.invoke(Channel.REQUEST_ONE_VIDEO, options);
  }

  public deleteVideo(video: IVideo): Promise<void> {
    return this.electronService.invoke(Channel.REQUEST_DELETE_ONE_VIDEO, video);
  }

  public deleteVideos(videos: IVideo[]): Promise<void> {
    return this.electronService.invoke(
      Channel.REQUEST_DELETE_ALL_VIDEO,
      videos,
    );
  }

  public updateVideo(video: Partial<IVideo>): Promise<IVideo> {
    return this.electronService.invoke(
      Channel.REQUEST_VIDEO_METADATA_UPDATE,
      video,
    );
  }

  public onUploadVideo(): Observable<IUploadDone> {
    return this.electronService.fromEvent<IUploadDone>(Channel.UPLOAD_DONE);
  }
}

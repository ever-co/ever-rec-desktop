import { Injectable } from '@angular/core';
import { ElectronService } from '@ever-co/electron-data-access';
import { Channel, IPhoto, IPhotoSave } from '@ever-co/shared-utils';
import { Observable, of } from 'rxjs';

@Injectable({
  providedIn: 'root',
})
export class PhotoCaptureService {
  constructor(private readonly electronService: ElectronService) {}

  public save(options: IPhotoSave): Promise<IPhoto> {
    return this.electronService.invoke(Channel.SAVE_PHOTO, options);
  }

  public stopCapture(): Observable<void> {
    return of(this.electronService.send(Channel.STOP_TRACKING));
  }

  public startCapture(): Observable<void> {
    return of(this.electronService.send(Channel.START_TRACKING));
  }

  public requestCapture(): Observable<void> {
    return this.electronService.fromEvent(Channel.TAKE_PHOTO);
  }

  public requestTracking(): Observable<void> {
    return this.electronService.fromEvent(Channel.REQUEST_TRACKING);
  }
}

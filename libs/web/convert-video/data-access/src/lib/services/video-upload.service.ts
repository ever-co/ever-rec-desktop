import { Injectable } from '@angular/core';
import { ElectronService } from '@ever-co/electron-data-access';
import { Channel, IUpload } from '@ever-co/shared-utils';
import { Observable, of } from 'rxjs';

@Injectable({
  providedIn: 'root',
})
export class VideoUploadService {
  constructor(private readonly electronService: ElectronService) {}

  public upload(config: IUpload): Observable<void> {
    return of(this.electronService.send(Channel.UPLOAD, config));
  }

  public cancel(): Observable<void> {
    return of(this.electronService.send(Channel.UPLOAD_CANCELED));
  }

  public onProgress(): Observable<number> {
    return new Observable<number>((observer) => {
      this.electronService.removeAllListeners(Channel.UPLOAD_PROGRESS);
      this.electronService.on(
        Channel.UPLOAD_PROGRESS,
        (_, progress: number) => {
          observer.next(progress);
        }
      );
      return () =>
        this.electronService.removeAllListeners(Channel.UPLOAD_PROGRESS);
    });
  }

  public onDone(): Observable<void> {
    return new Observable<void>((observer) => {
      this.electronService.removeAllListeners(Channel.UPLOAD_DONE);
      this.electronService.on(Channel.UPLOAD_DONE, () => {
        observer.next();
        observer.complete();
      });
      return () => this.electronService.removeAllListeners(Channel.UPLOAD_DONE);
    });
  }

  public onError(): Observable<string> {
    return new Observable<string>((observer) => {
      this.electronService.removeAllListeners(Channel.UPLOAD_ERROR);
      this.electronService.on(Channel.UPLOAD_ERROR, (_, error: string) => {
        observer.error(error);
      });
      return () =>
        this.electronService.removeAllListeners(Channel.UPLOAD_ERROR);
    });
  }
}

import { Injectable } from '@angular/core';
import { ElectronService } from '@ever-co/electron-data-access';
import { Channel, IUpload } from '@ever-co/shared-utils';
import { selectSettingStorageState } from '@ever-co/web-setting-data-access';
import { Store } from '@ngrx/store';
import { filter, map, Observable, of, take } from 'rxjs';

@Injectable({
  providedIn: 'root',
})
export class VideoUploadService {
  constructor(
    private readonly electronService: ElectronService,
    private store: Store
  ) {}

  public upload(upload: IUpload): Observable<void> {
    return this.store.select(selectSettingStorageState).pipe(
      take(1),
      filter(({ uploadConfig }) => uploadConfig.autoSync),
      map(({ s3Config }) =>
        this.electronService.send(Channel.UPLOAD, { upload, s3Config })
      )
    );
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
      this.electronService.on(Channel.UPLOAD_DONE, (_, result) => {
        observer.next(result);
        observer.complete();
      });
      return () => this.electronService.removeAllListeners(Channel.UPLOAD_DONE);
    });
  }

  public onError(): Observable<string> {
    return new Observable<string>((observer) => {
      this.electronService.removeAllListeners(Channel.UPLOAD_ERROR);
      this.electronService.on(Channel.UPLOAD_ERROR, (_, error: Error) => {
        observer.next(error.message ?? error);
        observer.complete();
      });
      return () =>
        this.electronService.removeAllListeners(Channel.UPLOAD_ERROR);
    });
  }
}

import { Injectable } from '@angular/core';
import { ElectronService } from '@ever-co/electron-data-access';
import { Channel, IUpload } from '@ever-co/shared-utils';
import { selectSettingStorageState } from '@ever-co/web-setting-data-access';
import { Store } from '@ngrx/store';
import { filter, map, Observable, of, take } from 'rxjs';

@Injectable({
  providedIn: 'root',
})
export class UploadService {
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
    return this.electronService.fromEvent<number>(Channel.UPLOAD_PROGRESS);
  }

  public onDone(): Observable<void> {
    return this.electronService.fromEvent<void>(Channel.UPLOAD_DONE);
  }

  public onError(): Observable<string> {
    return this.electronService
      .fromEvent<Error>(Channel.UPLOAD_ERROR)
      .pipe(map((error: Error) => error.message ?? error));
  }
}

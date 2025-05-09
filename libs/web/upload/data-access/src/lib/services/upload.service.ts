import { Injectable } from '@angular/core';
import { ElectronService } from '@ever-co/electron-data-access';
import {
  Channel,
  IUpload,
  IUploadDone,
  IUploadError,
  IUploadProgress,
} from '@ever-co/shared-utils';
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

  public cancel(itemId: string): Observable<void> {
    return of(this.electronService.send(Channel.UPLOAD_CANCELED, { itemId }));
  }

  public onProgress(): Observable<IUploadProgress> {
    return this.electronService.fromEvent<IUploadProgress>(
      Channel.UPLOAD_PROGRESS
    );
  }

  public onDone(): Observable<IUploadDone> {
    return this.electronService.fromEvent<IUploadDone>(Channel.UPLOAD_DONE);
  }

  public onError(): Observable<IUploadError> {
    return this.electronService.fromEvent<IUploadError>(Channel.UPLOAD_ERROR);
  }
}

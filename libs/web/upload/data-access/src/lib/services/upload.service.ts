import { Inject, Injectable } from '@angular/core';
import { selectClaimsToken, selectToken } from '@ever-co/auth-data-access';
import { ElectronService } from '@ever-co/electron-data-access';
import { REC_ENV } from '@ever-co/shared-service';
import {
  Channel,
  IAudio,
  IEnvironment,
  IFindManyOptions,
  IPhoto,
  IScreenshot,
  IUpload,
  IUploadDone,
  IUploadError,
  IUploadProgress,
} from '@ever-co/shared-utils';
import { selectSettingStorageState } from '@ever-co/web-setting-data-access';
import { Store } from '@ngrx/store';
import { filter, map, Observable, of, take, withLatestFrom } from 'rxjs';

@Injectable({
  providedIn: 'root',
})
export class UploadService {
  constructor(
    private readonly electronService: ElectronService,
    private readonly store: Store,
    @Inject(REC_ENV)
    private readonly environment: IEnvironment,
  ) {}

  public upload(upload: IUpload): Observable<void> {
    return this.store.select(selectSettingStorageState).pipe(
      take(1),
      filter(({ uploadConfig }) => uploadConfig.autoSync),
      withLatestFrom(this.store.select(selectClaimsToken)),
      map(([{ s3Config }, claims]) =>
        this.electronService.send(Channel.UPLOAD, {
          upload: {
            ...upload,
            apiUrl: this.environment.apiUrl,
            token: claims.token,
            refreshToken: claims.refreshToken,
          },
          s3Config,
        }),
      ),
    );
  }

  public cancel(itemId: string): Observable<void> {
    return of(this.electronService.send(Channel.UPLOAD_CANCELED, { itemId }));
  }

  public onProgress(): Observable<IUploadProgress> {
    return this.electronService.fromEvent<IUploadProgress>(
      Channel.UPLOAD_PROGRESS,
    );
  }

  public onDone(): Observable<IUploadDone> {
    return this.electronService.fromEvent<IUploadDone>(Channel.UPLOAD_DONE);
  }

  public onError(): Observable<IUploadError> {
    return this.electronService.fromEvent<IUploadError>(Channel.UPLOAD_ERROR);
  }

  public getScreenshots(
    options: IFindManyOptions<IScreenshot>,
  ): Observable<IScreenshot[]> {
    return this.electronService.invoke$(
      Channel.GET_SCREENSHOTS_TO_UPLOAD,
      options,
    );
  }

  public getPhotos(options: IFindManyOptions<IPhoto>): Observable<IPhoto[]> {
    return this.electronService.invoke$(Channel.GET_PHOTOS_TO_UPLOAD, options);
  }

  public getAudios(options: IFindManyOptions<IAudio>): Observable<IAudio[]> {
    return this.electronService.invoke$(Channel.GET_AUDIOS_TO_UPLOAD, options);
  }
}

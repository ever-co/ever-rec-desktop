import { Injectable } from '@angular/core';
import { ElectronService } from '@ever-co/electron-data-access';
import {
  Channel,
  IPaginationOptions,
  IPaginationResponse,
  IPhoto,
  IPhotoSave,
} from '@ever-co/shared-utils';
import { Observable, of } from 'rxjs';

@Injectable({
  providedIn: 'root',
})
export class PhotoService {
  constructor(private readonly electronService: ElectronService) {}

  public save(options: IPhotoSave): Promise<IPhoto> {
    return this.electronService.invoke(Channel.SAVE_PHOTO, options);
  }

  public getAllPhotos(
    options: IPaginationOptions<IPhoto>
  ): Promise<IPaginationResponse<IPhoto>> {
    return this.electronService.invoke(Channel.GET_ALL_PHOTOS, options);
  }

  public getOnePhoto<T>(options: T): Promise<IPhoto> {
    console.log(options);
    return this.electronService.invoke(Channel.GET_PHOT0, options);
  }

  public deletePhoto(photo: IPhoto): Promise<void> {
    return this.electronService.invoke(Channel.DELETE_PHOTO, photo);
  }

  public deleteAllPhoto(photos: IPhoto[]): Promise<void> {
    return this.electronService.invoke(Channel.DELETE_ALL_PHOTOS, photos);
  }

  public stopCapture(): Observable<void> {
    return of(this.electronService.send(Channel.STOP_TRACKING));
  }

  public startCapture(): Observable<void> {
    return of(this.electronService.send(Channel.START_TRACKING));
  }

  public onTakePhoto(): Observable<void> {
    return new Observable<void>((observer) => {
      this.electronService.on(Channel.TAKE_PHOTO, () => {
        console.log('Take photo...');
        observer.next();
      });
    });
  }

  public onStartTracking(): Observable<void> {
    return new Observable<void>((observer) => {
      this.electronService.on(Channel.START_TRACKING, () => {
        console.log('Start tracking...');
        observer.next();
      });
    });
  }
}

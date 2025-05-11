import { Injectable } from '@angular/core';
import { ElectronService } from '@ever-co/electron-data-access';
import {
  Channel,
  IPaginationOptions,
  IPaginationResponse,
  IPhoto,
  IUploadDone,
} from '@ever-co/shared-utils';
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root',
})
export class PhotoService {
  constructor(private readonly electronService: ElectronService) {}

  public getAllPhotos(
    options: IPaginationOptions<IPhoto>,
  ): Promise<IPaginationResponse<IPhoto>> {
    return this.electronService.invoke(Channel.GET_ALL_PHOTOS, options);
  }

  public getOnePhoto<T>(options: T): Promise<IPhoto> {
    return this.electronService.invoke(Channel.GET_PHOT0, options);
  }

  public deletePhoto(photo: IPhoto): Promise<void> {
    return this.electronService.invoke(Channel.DELETE_PHOTO, photo);
  }

  public deleteAllPhoto(photos?: IPhoto[]): Promise<void> {
    return this.electronService.invoke(Channel.DELETE_ALL_PHOTOS, photos);
  }

  public onUploadPhoto(): Observable<IUploadDone> {
    return this.electronService.fromEvent<IUploadDone>(Channel.UPLOAD_DONE);
  }
}

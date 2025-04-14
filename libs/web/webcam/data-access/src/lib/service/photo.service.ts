import { Injectable } from '@angular/core';
import { ElectronService } from '@ever-co/electron-data-access';
import {
  Channel,
  IPaginationOptions,
  IPaginationResponse,
  IPhoto,
  IPhotoSave,
} from '@ever-co/shared-utils';

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
    return this.electronService.invoke(Channel.GET_PHOT0, options);
  }

  public deletePhoto(photo: IPhoto): Promise<void> {
    return this.electronService.invoke(Channel.DELETE_PHOTO, photo);
  }
}

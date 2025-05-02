import { Injectable } from '@angular/core';
import { ElectronService } from '@ever-co/electron-data-access';
import {
  Channel,
  IAudio,
  IAudioSave,
  IFindOneOptions,
  IPaginationOptions,
  IPaginationResponse,
} from '@ever-co/shared-utils';
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root',
})
export class AudioService {
  constructor(private readonly electronService: ElectronService) {}

  public save(options: IAudioSave): Observable<IAudio> {
    return this.electronService.invoke$(Channel.SAVE_AUDIO, options);
  }

  public getAll(
    options: IPaginationOptions<IAudio>
  ): Observable<IPaginationResponse<IAudio>> {
    return this.electronService.invoke$(Channel.GET_ALL_AUDIO, options);
  }

  public getOne(options: IFindOneOptions<IAudio>): Observable<IAudio> {
    return this.electronService.invoke$(Channel.GET_AUDIO, options);
  }

  public delete(audio: IAudio): Observable<void> {
    return this.electronService.invoke$(Channel.DELETE_PHOTO, audio);
  }

  public deleteAll(audios?: IAudio[]): Observable<void> {
    return this.electronService.invoke$(Channel.DELETE_ALL_AUDIO, audios);
  }
}

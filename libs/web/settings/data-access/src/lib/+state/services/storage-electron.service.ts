import { Injectable } from '@angular/core';
import { ElectronService } from '@ever-co/electron-data-access';
import { Channel, IUsedSize } from '@ever-co/shared-utils';
import { IStorageState } from '../storage-setting/storage-setting.reducer';

@Injectable({
  providedIn: 'root',
})
export class StorageElectronService {
  constructor(private readonly electronService: ElectronService) {}

  public getUsedSize(): Promise<IUsedSize> {
    return this.electronService.invoke(Channel.GET_USED_SIZE);
  }

  public cleanUp(state: Partial<IStorageState>): void {
    this.electronService.send(Channel.CLEAN_UP_DATA, state);
  }
}

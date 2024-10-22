import { Injectable } from '@angular/core';
import { ElectronService } from '@ever-co/electron-data-access';
import { Channel, IUsedSize } from '@ever-co/shared-utils';

@Injectable({
  providedIn: 'root',
})
export class StorageElectronService {
  constructor(private readonly electronService: ElectronService) {}

  public getUsedSize(): Promise<IUsedSize> {
    return this.electronService.invoke(Channel.GET_USED_SIZE);
  }
}

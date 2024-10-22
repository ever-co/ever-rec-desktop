import { Injectable } from '@angular/core';
import { ElectronService } from '@ever-co/electron-data-access';
import { Channel } from '@ever-co/shared-utils';

@Injectable({
  providedIn: 'root',
})
export class StorageElectronService {
  constructor(private readonly electronService: ElectronService) {}

  public getTotalSize(): Promise<number> {
    return this.electronService.invoke(Channel.GET_TOTAL_SIZE);
  }
}

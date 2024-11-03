import { Injectable } from '@angular/core';
import { ElectronService } from '@ever-co/electron-data-access';
import { Channel } from '@ever-co/shared-utils';

@Injectable({
  providedIn: 'root',
})
export class NotificationElectronService {
  constructor(private readonly electronService: ElectronService) {}

  public setIconCounter(count: number) {
    this.electronService.send(Channel.UPDATE_ICON_BADGE, count);
  }
}

import { Injectable } from '@angular/core';
import { ElectronService } from '@ever-co/electron-data-access';
import { Channel } from '@ever-co/shared-utils';

@Injectable({
  providedIn: 'root',
})
export class KeytarService {
  constructor(private readonly electronService: ElectronService) {}

  public setPassword(account: string, password: string): Promise<void> {
    return this.electronService.invoke(Channel.SET_PASSWORD, {
      account,
      password,
    });
  }

  public getPassword(account: string): Promise<string | null> {
    return this.electronService.invoke(Channel.GET_PASSWORD, account);
  }

  public deletePassword(account: string): Promise<void> {
    return this.electronService.invoke(Channel.DELETE_PASSWORD, account);
  }
}

import { Injectable } from '@angular/core';
import { ElectronService } from '@ever-co/electron-data-access';
import {
  Channel,
  IAudio,
  IAudioSave
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

  public async availableDevices(): Promise<MediaDeviceInfo[]> {
    try {
      const devices = await navigator.mediaDevices.enumerateDevices();
      return devices.filter((device) => device.kind === 'audioinput');
    } catch (err) {
      console.error('Error enumerating devices:', err);
      return [];
    }
  }
}

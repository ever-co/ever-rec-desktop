import { Injectable } from '@angular/core';
import { IAudio } from '@ever-co/shared-utils';
import { Observable, share, Subject } from 'rxjs';

interface ISeekSync {
  audio: IAudio;
  ratio: number;
}

@Injectable({
  providedIn: 'root',
})
export class AudioPlayerSyncService {
  private _playPauseSyncSubject = new Subject<IAudio>();
  private _seekSyncSubject = new Subject<ISeekSync>();

  public readonly onSynchronizePlayPause: Observable<IAudio> =
    this._playPauseSyncSubject.asObservable().pipe(share());

  public readonly onSynchronizeSeek: Observable<ISeekSync> =
    this._seekSyncSubject.asObservable().pipe(share());

  public synchronizePlayPause(audio: IAudio) {
    this._playPauseSyncSubject.next(audio);
  }

  public synchronizeSeek(input: ISeekSync) {
    this._seekSyncSubject.next(input);
  }
}

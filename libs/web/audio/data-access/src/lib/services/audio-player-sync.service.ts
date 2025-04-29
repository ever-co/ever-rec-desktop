import { Injectable } from '@angular/core';
import { IAudio } from '@ever-co/shared-utils';
import { Observable, share, Subject } from 'rxjs';

@Injectable({
  providedIn: 'root',
})
export class AudioPlayerSyncService {
  private _syncSubject = new Subject<IAudio>();

  public readonly onSynchronize: Observable<IAudio> = this._syncSubject
    .asObservable()
    .pipe(share());

  public synchronize(audio: IAudio) {
    this._syncSubject.next(audio);
  }
}

import { Inject, Injectable } from '@angular/core';
import { FallbackAudioStrategy } from './workers/concretes/fallback-audio.strategy';
import { WebWorkerAudioStrategy } from './workers/concretes/web-worker-audio.strategy';
import { IAudioWorkerStrategy } from './workers/interfaces/audio-worker-strategy.interface';
import { REC_ENV } from '@ever-co/shared-service';
import { IEnvironment } from '@ever-co/shared-utils';

@Injectable({ providedIn: 'root' })
export class AudioWorkerStrategyFactory {
  public constructor(@Inject(REC_ENV) private env: IEnvironment) {}
  public createStrategy(): IAudioWorkerStrategy {
    if (typeof Worker !== 'undefined' && this.env.canUseWebWorker) {
      try {
        return new WebWorkerAudioStrategy();
      } catch (error) {
        console.warn('Failed to initialize audio worker:', error);
        return new FallbackAudioStrategy();
      }
    } else {
      console.warn('Web Workers are not supported in this environment');
      return new FallbackAudioStrategy();
    }
  }
}

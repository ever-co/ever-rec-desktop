import { Injectable } from "@angular/core";
import { FallbackAudioStrategy } from "./workers/concretes/fallback-audio.strategy";
import { WebWorkerAudioStrategy } from "./workers/concretes/web-worker-audio.strategy";
import { IAudioWorkerStrategy } from "./workers/interfaces/audio-worker-strategy.interface";

@Injectable({ providedIn: 'root' })
export class AudioWorkerStrategyFactory {
  public createStrategy(): IAudioWorkerStrategy {
    if (typeof Worker !== 'undefined') {
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
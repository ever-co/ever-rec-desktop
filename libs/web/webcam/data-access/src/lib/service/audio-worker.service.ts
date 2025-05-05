import { Injectable } from '@angular/core';
import { IAudioSave } from '@ever-co/shared-utils';
import { Observable } from 'rxjs';
import { AudioWorkerStrategyFactory } from './audio-worker-strategy.factory';
import { IAudioWorkerStrategy } from './workers/interfaces/audio-worker-strategy.interface';

@Injectable({ providedIn: 'root' })
export class AudioWorkerService {
  private strategy: IAudioWorkerStrategy;

  constructor(factory: AudioWorkerStrategyFactory) {
    this.strategy = factory.createStrategy();
  }

  public saveChunk(chunk: BlobPart): void {
    this.strategy.saveChunk(chunk);
  }

  public cleanChunks(): void {
    this.strategy.cleanChunks();
  }

  public processAudio(): Observable<IAudioSave> {
    return this.strategy.processAudio();
  }

  public terminate(): void {
    this.strategy.terminate();
  }
}

import { Injectable } from '@angular/core';
import { IAudioSave } from '@ever-co/shared-utils';
import { Observable, Subject } from 'rxjs';
import { MessageType } from './workers/interfaces/audio-worker.interface';

@Injectable({ providedIn: 'root' })
export class AudioWorkerService {
  private worker!: Worker;

  constructor() {
    if (typeof Worker !== 'undefined') {
      // For Angular 12+ with Webpack 5
      this.worker = new Worker(
        new URL('./workers/audio.worker', import.meta.url),
        {
          type: 'module',
          name: 'audio-worker',
        }
      );
    } else {
      // Fallback for browsers without Web Worker support
      console.warn('Web Workers are not supported in this environment');
    }
  }

  public saveChunk(chunk: BlobPart): void {
    this.worker.postMessage({
      type: MessageType.SAVE_CHUNK,
      chunk,
    });
  }

  public cleanChunks(): void {
    this.worker.postMessage({
      type: MessageType.CLEAR_CHUNKS,
    });
  }

  public processAudio(): Observable<IAudioSave> {
    const workerSubject = new Subject<IAudioSave>();

    this.worker.onmessage = async ({ data }) => {
      if (data.type === MessageType.AUDIO_PROCESSED) {
        const arrayBuffer = data.result;
        const audioContext = new AudioContext();
        const audioBuffer = await audioContext.decodeAudioData(
          arrayBuffer.slice(0)
        );

        audioContext.close();

        const duration = audioBuffer.duration;
        const channels = audioBuffer.numberOfChannels;
        const rate = audioBuffer.sampleRate;

        workerSubject.next({ arrayBuffer, duration, channels, rate });
        workerSubject.complete();
      } else if (data.type === MessageType.AUDIO_ERROR) {
        workerSubject.error(data.error);
      }
    };

    this.worker.postMessage({ type: MessageType.PROCESS_AUDIO });

    return workerSubject.asObservable();
  }

  terminate() {
    this.worker.terminate();
  }
}

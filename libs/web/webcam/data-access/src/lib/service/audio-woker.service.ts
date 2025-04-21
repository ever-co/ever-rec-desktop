import { Injectable } from '@angular/core';
import { IAudioSave } from '@ever-co/shared-utils';
import { Observable, Subject } from 'rxjs';

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

  public processAudio(chunks: BlobPart[]): Observable<IAudioSave> {
    const workerSubject = new Subject<IAudioSave>();

    this.worker.onmessage = async ({ data }) => {
      if (data.type === 'AUDIO_PROCESSED') {
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
      } else if (data.type === 'AUDIO_ERROR') {
        workerSubject.error(data.error);
      }
    };

    this.worker.postMessage({
      type: 'PROCESS_AUDIO',
      chunks,
    });

    return workerSubject.asObservable();
  }

  terminate() {
    this.worker.terminate();
  }
}

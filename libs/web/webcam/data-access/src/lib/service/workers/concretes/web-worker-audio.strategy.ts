import { Observable, Subject } from 'rxjs';
import { IAudioSave } from '@ever-co/shared-utils';
import { MessageType } from '../interfaces/audio-worker.interface';
import { IAudioWorkerStrategy } from '../interfaces/audio-worker-strategy.interface';

export class WebWorkerAudioStrategy implements IAudioWorkerStrategy {
  private worker: Worker;

  constructor() {
    this.worker = new Worker(new URL('../audio.worker', import.meta.url), {
      type: 'module',
      name: 'audio-worker',
    });
    if (!this.worker) {
      throw new Error("There's an issue with web worker");
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

  public terminate(): void {
    this.worker.terminate();
  }
}

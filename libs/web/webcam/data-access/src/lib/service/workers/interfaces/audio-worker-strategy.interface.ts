import { Observable } from 'rxjs';
import { IAudioSave } from '@ever-co/shared-utils';

export interface IAudioWorkerStrategy {
  saveChunk(chunk: BlobPart): void;
  cleanChunks(): void;
  processAudio(): Observable<IAudioSave>;
  terminate(): void;
}

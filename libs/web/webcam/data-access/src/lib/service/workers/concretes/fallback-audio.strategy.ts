import { IAudioSave } from '@ever-co/shared-utils';
import { concatMap, from, Observable } from 'rxjs';
import { IAudioWorkerStrategy } from '../interfaces/audio-worker-strategy.interface';
import { AudioChunkManager } from './audio-chunk-manager';
import { WebmAudioProcessor } from './webm-audio.processor';

export class FallbackAudioStrategy implements IAudioWorkerStrategy {
  private chunkManager: AudioChunkManager = new AudioChunkManager();
  private processor = new WebmAudioProcessor();

  public saveChunk(chunk: BlobPart): void {
    this.chunkManager.addChunk(chunk);
  }

  public cleanChunks(): void {
    this.chunkManager.clearChunks();
  }

  public processAudio(): Observable<IAudioSave> {
    const chunks = this.chunkManager.getChunks();
    return from(this.processor.process(chunks)).pipe(
      concatMap(async (arrayBuffer) => {
        try {
          const audioContext = new AudioContext();
          const audioBuffer = await audioContext.decodeAudioData(
            arrayBuffer.slice(0)
          );

          await audioContext.close();

          const duration = audioBuffer.duration;
          const channels = audioBuffer.numberOfChannels;
          const rate = audioBuffer.sampleRate;

          return { arrayBuffer, duration, channels, rate };
        } catch (error) {
          throw new Error('Audio processing failed: ' + error);
        }
      })
    );
  }

  public terminate(): void {
    this.cleanChunks();
  }
}

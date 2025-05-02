import { AudioProcessor } from '../abstracts/audio-processor';
import { MessageHandler } from '../abstracts/message-handler';
import { AudioMessage } from '../interfaces/audio-worker.interface';
import { AudioChunkManager } from './audio-chunk-manager';
import { ClearChunkHandler } from './handlers/clear-chunk.handler';
import { ProcessAudioHandler } from './handlers/process-audio.handler';
import { SaveChunkHandler } from './handlers/save-chunk.handler';

// Factory Pattern for worker initialization
export class HandlerFactory {
  public static createHandlers(
    chunkManager: AudioChunkManager,
    audioProcessor: AudioProcessor
  ): MessageHandler<AudioMessage>[] {
    return [
      new ProcessAudioHandler(chunkManager, audioProcessor),
      new SaveChunkHandler(chunkManager),
      new ClearChunkHandler(chunkManager),
    ];
  }
}

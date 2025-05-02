import { AudioProcessor } from '../abstracts/audio-processor';
import { MessageHandler } from '../abstracts/message-handler';
import {
  AudioMessage,
  WorkerMessage,
} from '../interfaces/audio-worker.interface';
import { AudioChunkManager } from './audio-chunk-manager';
import { HandlerFactory } from './handler.factory';

// Main worker class with optimized handler lookup
export class AudioWorker {
  private handlerMap: Map<string, MessageHandler<AudioMessage>>;

  constructor(
    chunkManager: AudioChunkManager,
    audioProcessor: AudioProcessor,
    handlers = HandlerFactory.createHandlers(chunkManager, audioProcessor)
  ) {
    this.handlerMap = new Map();
    handlers.forEach((handler) => {
      this.handlerMap.set(handler.messageType, handler);
    });
  }

  public async handleMessage(message: WorkerMessage): Promise<void> {
    const handler = this.handlerMap.get(message.type);
    if (handler && handler.canHandle(message)) {
      await handler.handle(message);
    }
  }
}

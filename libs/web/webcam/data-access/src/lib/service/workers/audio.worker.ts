/// <reference lib="webworker" />

// Interface Segregation Principle - Specific message interfaces
interface AudioMessage {
  type: string;
}

interface ProcessAudioMessage extends AudioMessage {
  type: 'PROCESS_AUDIO';
}

interface SaveChunkMessage extends AudioMessage {
  type: 'SAVE_CHUNK';
  chunk: BlobPart;
}

interface ClearChunkMessage extends AudioMessage {
  type: 'CLEAR_CHUNKS';
}

type WorkerMessage = ProcessAudioMessage | SaveChunkMessage | ClearChunkMessage;

// Single Responsibility Principle - Chunk management separated
class AudioChunkManager {
  private chunks: BlobPart[] = [];

  addChunk(chunk: BlobPart): void {
    this.chunks.push(chunk);
  }

  clearChunks(): void {
    this.chunks = [];
  }

  getChunks(): BlobPart[] {
    return [...this.chunks]; // Return immutable copy
  }
}

// Strategy Pattern with type-safe generic handlers
interface MessageHandler<T extends AudioMessage> {
  readonly messageType: T['type'];
  canHandle(message: AudioMessage): message is T;
  handle(message: T): Promise<void>;
}

class ProcessAudioHandler implements MessageHandler<ProcessAudioMessage> {
  readonly messageType = 'PROCESS_AUDIO';

  constructor(
    private chunkManager: AudioChunkManager,
    private audioProcessor: AudioProcessor
  ) {}

  canHandle(message: AudioMessage): message is ProcessAudioMessage {
    return message.type === this.messageType;
  }

  async handle(): Promise<void> {
    try {
      const chunks = this.chunkManager.getChunks();
      const result = await this.audioProcessor.process(chunks);
      postMessage({ type: 'AUDIO_PROCESSED', result });
    } catch (error) {
      postMessage({
        type: 'AUDIO_ERROR',
        error: error instanceof Error ? error.message : 'Unknown error',
      });
    } finally {
      this.chunkManager.clearChunks();
    }
  }
}

class SaveChunkHandler implements MessageHandler<SaveChunkMessage> {
  readonly messageType = 'SAVE_CHUNK';

  constructor(private chunkManager: AudioChunkManager) {}

  canHandle(message: AudioMessage): message is SaveChunkMessage {
    return message.type === this.messageType;
  }

  async handle(message: SaveChunkMessage): Promise<void> {
    this.chunkManager.addChunk(message.chunk);
  }
}

class ClearChunkHandler implements MessageHandler<ClearChunkMessage> {
  readonly messageType = 'CLEAR_CHUNKS';

  constructor(private chunkManager: AudioChunkManager) {}

  canHandle(message: AudioMessage): message is ClearChunkMessage {
    return message.type === this.messageType;
  }

  async handle(): Promise<void> {
    this.chunkManager.clearChunks();
  }
}

// Dependency Inversion Principle - Audio processing abstraction
interface AudioProcessor {
  process(chunks: BlobPart[]): Promise<ArrayBuffer>;
}

class WebmAudioProcessor implements AudioProcessor {
  async process(chunks: BlobPart[]): Promise<ArrayBuffer> {
    const blob = new Blob(chunks, { type: 'audio/webm; codecs=opus' });
    return blob.arrayBuffer();
  }
}

// Factory Pattern for worker initialization
class HandlerFactory {
  static createHandlers(
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

// Main worker class with optimized handler lookup
class AudioWorker {
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

  async handleMessage(message: WorkerMessage): Promise<void> {
    const handler = this.handlerMap.get(message.type);
    if (handler && handler.canHandle(message)) {
      await handler.handle(message);
    }
  }
}

// Dependency injection and worker initialization
const chunkManager = new AudioChunkManager();
const audioProcessor = new WebmAudioProcessor();
const audioWorker = new AudioWorker(chunkManager, audioProcessor);

// Open/Closed Principle - New message types can be added without modifying this
addEventListener('message', async ({ data }: { data: WorkerMessage }) => {
  await audioWorker.handleMessage(data);
});

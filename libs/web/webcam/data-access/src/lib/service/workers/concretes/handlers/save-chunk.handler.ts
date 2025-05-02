import { MessageHandler } from '../../abstracts/message-handler';
import {
  AudioMessage,
  MessageType,
  SaveChunkMessage,
} from '../../interfaces/audio-worker.interface';
import { AudioChunkManager } from '../audio-chunk-manager';

export class SaveChunkHandler implements MessageHandler<SaveChunkMessage> {
  readonly messageType = MessageType.SAVE_CHUNK;

  constructor(private chunkManager: AudioChunkManager) {}

  public canHandle(message: AudioMessage): message is SaveChunkMessage {
    return message.type === this.messageType;
  }

  public async handle(message: SaveChunkMessage): Promise<void> {
    this.chunkManager.addChunk(message.chunk);
  }
}

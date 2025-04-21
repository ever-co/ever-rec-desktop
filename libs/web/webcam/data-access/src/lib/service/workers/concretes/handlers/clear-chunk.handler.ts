import { MessageHandler } from '../../abstracts/message-handler';
import {
  AudioMessage,
  ClearChunkMessage,
  MessageType,
} from '../../interfaces/audio-worker.interface';
import { AudioChunkManager } from '../audio-chunk-manager';

export class ClearChunkHandler implements MessageHandler<ClearChunkMessage> {
  readonly messageType = MessageType.CLEAR_CHUNKS;

  constructor(private chunkManager: AudioChunkManager) {}

  public canHandle(message: AudioMessage): message is ClearChunkMessage {
    return message.type === this.messageType;
  }

  public async handle(): Promise<void> {
    this.chunkManager.clearChunks();
  }
}

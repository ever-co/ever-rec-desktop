import { AudioMessage } from '../interfaces/audio-worker.interface';

export interface MessageHandler<T extends AudioMessage> {
  readonly messageType: T['type'];
  canHandle(message: AudioMessage): message is T;
  handle(message: T): Promise<void>;
}

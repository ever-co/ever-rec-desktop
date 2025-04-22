import { AudioProcessor } from '../../abstracts/audio-processor';
import { MessageHandler } from '../../abstracts/message-handler';
import {
  AudioMessage,
  MessageType,
  ProcessAudioMessage,
} from '../../interfaces/audio-worker.interface';
import { AudioChunkManager } from '../audio-chunk-manager';

export class ProcessAudioHandler
  implements MessageHandler<ProcessAudioMessage>
{
  readonly messageType = MessageType.PROCESS_AUDIO;

  constructor(
    private chunkManager: AudioChunkManager,
    private audioProcessor: AudioProcessor
  ) {}

  public canHandle(message: AudioMessage): message is ProcessAudioMessage {
    return message.type === this.messageType;
  }

  public async handle(): Promise<void> {
    try {
      const chunks = this.chunkManager.getChunks();
      if (!chunks.length) {
        throw new Error('No audio chunks found');
      }
      const result = await this.audioProcessor.process(chunks);
      postMessage({ type: MessageType.AUDIO_PROCESSED, result });
    } catch (error) {
      postMessage({
        type: MessageType.AUDIO_ERROR,
        error: error instanceof Error ? error.message : 'Unknown error',
      });
    }
  }
}

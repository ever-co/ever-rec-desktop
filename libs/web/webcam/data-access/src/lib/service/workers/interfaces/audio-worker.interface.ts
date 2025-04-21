// Interface Segregation Principle - Specific message interfaces
export enum MessageType {
  PROCESS_AUDIO = '[Audio Worker] Process Audio',
  SAVE_CHUNK = '[Audio Worker] Save Chunk',
  CLEAR_CHUNKS = '[Audio Worker] Clear Chunks',
  AUDIO_PROCESSED = '[Audio Worker] Audio Processed',
  AUDIO_ERROR = '[Audio Worker] Audio Error',
}

export interface AudioMessage {
  type: MessageType;
}

export interface ProcessAudioMessage extends AudioMessage {
  type: MessageType.PROCESS_AUDIO;
}

export interface SaveChunkMessage extends AudioMessage {
  type: MessageType.SAVE_CHUNK;
  chunk: BlobPart;
}

export interface ClearChunkMessage extends AudioMessage {
  type: MessageType.CLEAR_CHUNKS;
}

export type WorkerMessage =
  | ProcessAudioMessage
  | SaveChunkMessage
  | ClearChunkMessage;

import { AudioProcessor } from '../abstracts/audio-processor';

export class WebmAudioProcessor implements AudioProcessor {
  public async process(chunks: BlobPart[]): Promise<ArrayBuffer> {
    const blob = new Blob(chunks, { type: 'audio/webm; codecs=opus' });
    return blob.arrayBuffer();
  }
}

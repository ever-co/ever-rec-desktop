import { IAudioUpload } from '@ever-co/shared-utils';
import { AudioUploadRepository } from '../repositories/audio-upload.repository';
import { AudioUpload } from '../entities/audio-upload.entity';

export class AudioUploadService {
  private readonly repository = AudioUploadRepository.instance;

  public async save(input: Partial<IAudioUpload>): Promise<IAudioUpload> {
    const upload = new AudioUpload();
    upload.remoteUrl = input.remoteUrl;
    upload.remoteId = input.remoteId;
    upload.uploadedAt = input.uploadedAt;
    upload.audioId = input.audioId;
    return this.repository.save(upload);
  }
}

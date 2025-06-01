import { IVideoUpload } from '@ever-co/shared-utils';
import { VideoUploadRepository } from '../repositories/video-upload.repository';
import { VideoUpload } from '../entities/video-upload.entity';

export class VideoUploadService {
  private readonly repository = VideoUploadRepository.instance;

  public async save(input: Partial<IVideoUpload>): Promise<IVideoUpload> {
    const upload = new VideoUpload();
    upload.remoteUrl = input.remoteUrl;
    upload.remoteId = input.remoteId;
    upload.uploadedAt = input.uploadedAt;
    upload.videoId = input.videoId;
    return this.repository.save(upload);
  }
}

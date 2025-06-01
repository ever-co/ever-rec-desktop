import { IPhotoUpload } from '@ever-co/shared-utils';
import { PhotoUploadRepository } from '../repositories/photo-upload.repository';
import { PhotoUpload } from '../entities/photo-upload.entity';

export class PhotoUploadService {
  private readonly repository = PhotoUploadRepository.instance;

  public async save(input: Partial<IPhotoUpload>): Promise<IPhotoUpload> {
    const upload = new PhotoUpload();
    upload.remoteUrl = input.remoteUrl;
    upload.remoteId = input.remoteId;
    upload.uploadedAt = input.uploadedAt;
    upload.photoId = input.photoId;
    return this.repository.save(upload);
  }
}

import { IPhoto, IPhotoService, IPhotoUpload, IRemoteUpload, IUpload, IUploadDone } from '@ever-co/shared-utils';
import { In } from 'typeorm';
import { FileManager } from '../../files/file-manager';
import { UploaderService } from './uploader.service';

export class PhotoUploaderService extends UploaderService<IPhoto> {
  constructor(service: IPhotoService) {
    super(service);
  }

  protected override async prepareFiles(upload: IUpload) {
    const data = await this.service.findAll({
      where: { id: In(upload.ids) },
      relations: ['metadata'],
    });

    return data.map((item: IPhoto) => ({
      recordedAt: this.toISOString(item.metadata?.createdAt),
      pathname: FileManager.decodePath(item.pathname),
      timeSlotId: this.getTimeSlotId(),
      id: item.id,
      key: upload.key,
    }));
  }

  protected override async synchronize({ itemId, result }: IUploadDone): Promise<void> {
    await Promise.all(
      [
        this.service.update(itemId, { synced: true }),
        this.service.saveUpload<IPhotoUpload>({
          id: itemId,
          remoteUrl: result.fullUrl,
          remoteId: result.id,
          uploadedAt: result.recordedAt,
        })
      ]
    );
  }
}

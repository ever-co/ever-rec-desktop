import { IPhoto, IPhotoService, IPhotoUpload, IRemoteUpload, IUpload } from '@ever-co/shared-utils';
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
      recordedAt: item.metadata?.createdAt,
      pathname: FileManager.decodePath(item.pathname),
      id: item.id,
      key: upload.key,
    }));
  }

  protected override async synchronize(upload: IUpload, remoteUpload: IRemoteUpload): Promise<void> {
    await Promise.all(
      upload.ids.map(async (id) => {
        await this.service.update(id, { synced: true });
        await this.service.saveUpload<IPhotoUpload>({
          id,
          remoteUrl: remoteUpload.fullUrl,
          remoteId: remoteUpload.id,
          uploadedAt: remoteUpload.recordedAt,
        });
      })
    );
  }
}

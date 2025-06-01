import { IAudio, IAudioService, IAudioUpload, IUpload } from '@ever-co/shared-utils';
import { IRemoteUpload } from '@ever-co/shared-utils';
import { In } from 'typeorm';
import { FileManager } from '../../files/file-manager';
import { UploaderService } from './uploader.service';

export class AudioUploaderService extends UploaderService<IAudio> {
  constructor(service: IAudioService) {
    super(service);
  }

  protected override async prepareFiles(upload: IUpload) {
    const data = await this.service.findAll({
      where: { id: In(upload.ids) },
      relations: ['metadata'],
    });

    return data.map((item: IAudio) => ({
      recordedAt: item.metadata?.createdAt,
      size: item.metadata?.size,
      duration: item.metadata?.duration,
      rate: item.metadata?.rate,
      channels: item.metadata?.channels,
      name: item.metadata?.name,
      pathname: FileManager.decodePath(item.pathname),
      id: item.id,
      key: upload.key,
    }));
  }

  protected override async synchronize(upload: IUpload, remoteUpload: IRemoteUpload): Promise<void> {
    await Promise.all(
      upload.ids.map(async (id) => {
        await this.service.update(id, { synced: true });
        await this.service.saveUpload<IAudioUpload>({
          id,
          remoteUrl: remoteUpload.fullUrl,
          remoteId: remoteUpload.id,
          uploadedAt: remoteUpload.recordedAt,
        });
      })
    );
  }
}

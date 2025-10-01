import {
  IUpload,
  IUploadDone,
  IVideo,
  IVideoService,
  IVideoUpload,
} from '@ever-co/shared-utils';

import { In } from 'typeorm';
import { FileManager } from '../../files/file-manager';
import { UploaderService } from './uploader.service';

export class VideoUploaderService extends UploaderService<IVideo> {
  constructor(service: IVideoService) {
    super(service);
  }

  protected override async prepareFiles(upload: IUpload) {
    const data = await this.service.findAll({
      where: { id: In(upload.ids) },
      relations: ['metadata'],
    });

    return data.map((item: IVideo) => ({
      title: item.metadata?.name,
      description: item.metadata?.summary,
      duration: item.metadata?.duration,
      recordedAt: this.toISOString(item.metadata?.createdAt),
      size: item.metadata?.size,
      resolution: item.metadata?.resolution,
      codec: item.metadata?.codec,
      frameRate: item.metadata?.frameRate,
      pathname: FileManager.decodePath(item.pathname),
      timeSlotId: this.getTimeSlotId(),
      id: item.id,
      key: upload.key,
    }));
  }

  protected override async synchronize(uploaded: IUploadDone): Promise<void> {
    await Promise.all([
      this.service.update(uploaded.itemId, { synced: true }),
      this.service.saveUpload<IVideoUpload>(
        this.synchronizeFactory.synchronize(this.context.strategy, uploaded),
      ),
    ]);
  }
}

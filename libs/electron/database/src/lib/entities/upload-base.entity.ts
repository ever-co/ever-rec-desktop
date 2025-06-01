import { Column } from 'typeorm';
import { Base } from './base.entity';
import { IUploadBase } from '@ever-co/shared-utils';

export abstract class UploadBase extends Base implements IUploadBase {
  @Column({ type: 'varchar', nullable: true })
  remoteUrl?: string;

  @Column({ type: 'uuid', nullable: true })
  remoteId?: string;

  @Column({ type: 'datetime', nullable: true })
  uploadedAt?: string;
}

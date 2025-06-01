import { IPhoto, IPhotoMetadata, IPhotoUpload, ITimeLog } from '@ever-co/shared-utils';
import { Base } from './base.entity';
import {
  Column,
  Entity,
  JoinColumn,
  ManyToOne,
  OneToMany,
  OneToOne,
  Relation,
} from 'typeorm';
import { TimeLog } from './time-log.entity';
import { PhotoMetadata } from './photo-metadata.entity';
import { PhotoUpload } from './photo-upload.entity';

@Entity('photo')
export class Photo extends Base implements IPhoto {
  @Column({ type: 'text', nullable: true })
  pathname: string;

  @Column({ default: false, type: 'boolean' })
  synced?: boolean;

  @OneToOne(() => PhotoMetadata, (metadata) => metadata.photo, {
    nullable: true,
    onDelete: 'CASCADE',
  })
  metadata: Relation<IPhotoMetadata>;

  @ManyToOne(() => TimeLog, {
    nullable: true,
    onDelete: 'CASCADE',
  })
  @JoinColumn()
  timeLog?: Relation<ITimeLog>;

  @Column({ nullable: true })
  timeLogId?: ITimeLog['id'];

  @OneToMany(() => PhotoUpload, (upload) => upload.photo, {
    nullable: true,
    onDelete: 'SET NULL',
  })
  uploads?: Relation<IPhotoUpload[]>;
}

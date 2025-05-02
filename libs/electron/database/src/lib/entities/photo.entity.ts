import { IPhoto, IPhotoMetadata, ITimeLog } from '@ever-co/shared-utils';
import { Base } from './base.entity';
import {
  Column,
  Entity,
  JoinColumn,
  ManyToOne,
  OneToOne,
  Relation,
} from 'typeorm';
import { TimeLog } from './time-log.entity';
import { PhotoMetadata } from './photo-metadata.entity';

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
}

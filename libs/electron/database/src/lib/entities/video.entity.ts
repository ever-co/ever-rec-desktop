import type {
  IScreenshot,
  ITimeLog,
  IVideo,
  IVideoMetadata,
} from '@ever-co/shared-utils';
import {
  Column,
  Entity,
  JoinColumn,
  ManyToOne,
  OneToMany,
  OneToOne,
  Relation,
} from 'typeorm';
import { Base } from './base.entity';
import { Screenshot } from './screenshot.entity';
import { TimeLog } from './time-log.entity';
import { VideoMetadata } from './video-metadata.entity';

@Entity('video')
export class Video extends Base implements IVideo {
  @Column({ type: 'text', nullable: true })
  pathname: string;

  @Column({ default: false, type: 'boolean' })
  synced?: boolean;

  @Column({ default: false, type: 'boolean' })
  timeLine?: boolean;

  @ManyToOne(() => Video, (video) => video.chunks, {
    nullable: true,
    onDelete: 'CASCADE',
  })
  parent?: Relation<IVideo>;

  @OneToMany(() => Video, (video) => video.parent, {
    onDelete: 'CASCADE',
    nullable: true,
  })
  chunks?: Relation<IVideo[]>;

  @OneToMany(() => Screenshot, (screenshot) => screenshot.video, {
    nullable: true,
    onDelete: 'SET NULL',
  })
  screenshots?: Relation<IScreenshot[]>;

  @OneToOne(() => VideoMetadata, (metadata) => metadata.video, {
    nullable: true,
    onDelete: 'CASCADE',
  })
  metadata?: Relation<IVideoMetadata>;

  @ManyToOne(() => TimeLog, (timeLog) => timeLog.videos, {
    nullable: true,
    onDelete: 'CASCADE',
  })
  @JoinColumn()
  timeLog?: Relation<ITimeLog>;
}

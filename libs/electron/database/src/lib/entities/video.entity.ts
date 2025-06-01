import type {
  IAudio,
  IScreenshot,
  ITimeline,
  ITimeLog,
  IVideo,
  IVideoMetadata,
  IVideoUpload,
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
import { Timeline } from './timeline.entity';
import { VideoMetadata } from './video-metadata.entity';
import { Audio } from './audio.entity';
import { VideoUpload } from './video-upload.entity';

@Entity('video')
export class Video extends Base implements IVideo {
  @Column({ type: 'text', nullable: true })
  pathname: string;

  @Column({ default: false, type: 'boolean' })
  synced?: boolean;

  @ManyToOne(() => Video, (video) => video.chunks, {
    nullable: true,
    onDelete: 'CASCADE',
  })
  @JoinColumn()
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

  @OneToMany(() => Timeline, (timeline) => timeline.video, {
    nullable: true,
    onDelete: 'SET NULL',
  })
  timelines?: Relation<ITimeline[]>;

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

  // Computed property
  isTimeline: boolean;

  @OneToOne(() => Audio, (audio) => audio.video, {
    nullable: true,
    onDelete: 'SET NULL',
  })
  audio: Relation<IAudio>;

  @OneToMany(() => VideoUpload, (upload) => upload.video, {
    nullable: true,
    onDelete: 'SET NULL',
  })
  uploads?: Relation<IVideoUpload[]>;
}

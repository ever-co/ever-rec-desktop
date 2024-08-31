import type {
    IScreenshot,
    IVideo,
    IVideoMetadata,
} from '@ever-co/shared-utils';
import {
    Column,
    Entity,
    ManyToOne,
    OneToMany,
    OneToOne,
    Relation,
} from 'typeorm';
import { Base } from './base.entity';
import { Screenshot } from './screenshot.entity';
import { VideoMetadata } from './video-metadata.entity';

@Entity('video')
export class Video extends Base implements IVideo {
  @Column({ type: 'text', nullable: true })
  pathname: string;

  @Column({ default: false, type: 'boolean' })
  synced?: boolean;

  @ManyToOne(() => Video, (video) => video.chunks, {
    nullable: true,
    onDelete: 'SET NULL',
  })
  parent?: Relation<IVideo>;

  @OneToMany(() => Video, (video) => video.parent, {
    onDelete: 'SET NULL',
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
    onDelete: 'SET NULL',
  })
  metadata?: Relation<IVideoMetadata>;
}

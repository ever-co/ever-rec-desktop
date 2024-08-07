import type { IVideo, IVideoMetadata } from '@ever-capture/shared/utils';
import { Column, Entity, JoinColumn, OneToOne, Relation } from 'typeorm';
import { Base } from './base.entity';
import { Video } from './video.entity';

@Entity()
export class VideoMetadata extends Base implements IVideoMetadata {
  @Column({ default: '15', type: 'integer' })
  frameRate?: number;

  @Column({ default: '1920:1080', type: 'text' })
  resolution?: string;

  @Column({ default: 'libx264', type: 'text' })
  codec?: string;

  @Column({ default: 100, type: 'integer' })
  batch?: number;

  @Column({ default: 0, type: 'integer' })
  duration?: number;

  @OneToOne(() => Video, (video) => video.metadata, {
    onDelete: 'CASCADE',
  })
  @JoinColumn()
  video?: Relation<IVideo>;
}

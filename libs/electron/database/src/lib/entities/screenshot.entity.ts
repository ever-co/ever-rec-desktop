import type {
  IScreenshot,
  IScreenshotMetadata,
  IVideo,
} from '@ever-capture/shared-utils';
import {
  Column,
  Entity,
  JoinColumn,
  ManyToOne,
  OneToOne,
  Relation,
} from 'typeorm';
import { Base } from './base.entity';
import { ScreenshotMetadata } from './screenshot-metadata.entity';
import { Video } from './video.entity';

@Entity('screenshot')
export class Screenshot extends Base implements IScreenshot {
  @Column({ type: 'text', nullable: true })
  pathname: string;

  @Column({ default: false, type: 'boolean' })
  synced: boolean;

  @OneToOne(() => ScreenshotMetadata, (metadata) => metadata.screenshot, {
    nullable: true,
    onDelete: 'SET NULL',
  })
  metadata: Relation<IScreenshotMetadata>;

  @ManyToOne(() => Video, (video) => video.chunks, {
    nullable: true,
    onDelete: 'SET NULL',
  })
  @JoinColumn()
  video?: Relation<IVideo>;
}

import type {
  IScreenshot,
  IScreenshotMetadata,
  IVideo,
} from '@prototype/shared/utils';
import {
  Column,
  Entity,
  JoinColumn,
  ManyToOne,
  OneToOne,
  Relation
} from 'typeorm';
import { Base } from './base.entity';
import { ScreenshotMetadata } from './screenshot-metadata.entity';
import { Video } from './video.entity';

@Entity()
export class Screenshot extends Base implements IScreenshot {
  @Column({ type: 'text', nullable: true })
  pathname: string;

  @Column({ default: false, type: 'boolean' })
  synced: boolean;

  @OneToOne(() => ScreenshotMetadata, (metadata) => metadata.screenshot, {
    nullable: true,
  })
  metadata: Relation<IScreenshotMetadata>;

  @ManyToOne(() => Video, (video) => video.chunks, { nullable: true })
  @JoinColumn()
  video?: Relation<IVideo>;
}

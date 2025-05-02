import type {
  IScreenshot,
  IScreenshotMetadata,
  ITimeLog,
  IVideo,
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
import { ScreenshotMetadata } from './screenshot-metadata.entity';
import { TimeLog } from './time-log.entity';
import { Video } from './video.entity';

@Entity('screenshot')
export class Screenshot extends Base implements IScreenshot {
  @Column({ type: 'text', nullable: true })
  pathname: string;

  @Column({ default: false, type: 'boolean' })
  synced: boolean;

  @ManyToOne(() => Screenshot, (screenshot) => screenshot.chunks, {
    nullable: true,
    onDelete: 'CASCADE',
  })
  @JoinColumn()
  parent?: Relation<IScreenshot>;

  @OneToMany(() => Screenshot, (screenshot) => screenshot.parent, {
    onDelete: 'CASCADE',
    nullable: true,
  })
  chunks?: Relation<IScreenshot[]>;

  @OneToOne(() => ScreenshotMetadata, (metadata) => metadata.screenshot, {
    nullable: true,
    onDelete: 'CASCADE',
  })
  metadata: Relation<IScreenshotMetadata>;

  @ManyToOne(() => Video, (video) => video.chunks, {
    nullable: true,
    onDelete: 'SET NULL',
  })
  @JoinColumn()
  video?: Relation<IVideo>;

  @ManyToOne(() => TimeLog, (timeLog) => timeLog.screenshots, {
    nullable: true,
    onDelete: 'CASCADE',
  })
  @JoinColumn()
  timeLog?: Relation<ITimeLog>;
}

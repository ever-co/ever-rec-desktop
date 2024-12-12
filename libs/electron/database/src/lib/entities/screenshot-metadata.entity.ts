import type { IApplication, IScreenshot, IScreenshotMetadata } from '@ever-co/shared-utils';
import { Column, Entity, JoinColumn, ManyToOne, OneToOne, Relation } from 'typeorm';
import { Application } from './application.entity';
import { Base } from './base.entity';
import { Screenshot } from './screenshot.entity';

@Entity('screenshot_metadata')
export class ScreenshotMetadata extends Base implements IScreenshotMetadata {
  @ManyToOne(() => Application, (application) => application.metadatas, {
    nullable: true,
    onDelete: 'CASCADE',
  })
  @JoinColumn()
  application: Relation<IApplication>;

  @Column({ type: 'text', nullable: true })
  description: string;

  @Column({ type: 'bigint', default: 0 })
  size: number;

  @OneToOne(() => Screenshot, (screenshot) => screenshot.metadata, {
    onDelete: 'CASCADE',
  })
  @JoinColumn()
  screenshot?: Relation<IScreenshot>;
}

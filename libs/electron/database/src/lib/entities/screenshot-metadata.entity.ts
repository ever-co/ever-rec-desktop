import type { IScreenshot, IScreenshotMetadata } from '@ever-capture/shared-utils';
import { Column, Entity, JoinColumn, OneToOne, Relation } from 'typeorm';
import { Base } from './base.entity';
import { Screenshot } from './screenshot.entity';

@Entity('screenshot_metadata')
export class ScreenshotMetadata extends Base implements IScreenshotMetadata {
  @Column({ nullable: true })
  name: string;

  @Column({ type: 'text', nullable: true })
  icon: string;

  @Column({ type: 'text', nullable: true })
  description: string;

  @OneToOne(() => Screenshot, (screenshot) => screenshot.metadata, {
    onDelete: 'SET NULL',
  })
  @JoinColumn()
  screenshot?: Relation<IScreenshot>;
}

import type { IScreenshot, IScreenshotMetadata } from '@ever-co/shared-utils';
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

  @Column({ type: 'bigint', default: 0 })
  size: number;

  @OneToOne(() => Screenshot, (screenshot) => screenshot.metadata, {
    onDelete: 'CASCADE',
  })
  @JoinColumn()
  screenshot?: Relation<IScreenshot>;
}

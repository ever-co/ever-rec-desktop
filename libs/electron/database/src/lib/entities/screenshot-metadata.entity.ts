import { IScreenshot, IScreenshotMetadata } from '@prototype/shared/utils';
import { Column, Entity, JoinColumn, OneToOne } from 'typeorm';
import { Base } from './base.entity';
import { Screenshot } from './screenshot.entity';

@Entity()
export class ScreenshotMetadata extends Base implements IScreenshotMetadata {
  @Column({ nullable: true })
  name: string;

  @Column({ type: 'text', nullable: true })
  icon: string;

  @Column({ type: 'text', nullable: true })
  description: string;

  @OneToOne(() => Screenshot, (it) => it.metadata, { onDelete: 'CASCADE' })
  @JoinColumn()
  screenshot?: IScreenshot;
}

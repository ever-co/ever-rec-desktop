import { IScreenshotMetadata } from '@prototype/shared/utils';
import { Column, Entity } from 'typeorm';
import { Base } from './base.entity';

@Entity()
export class ScreenshotMetadata extends Base implements IScreenshotMetadata {
  @Column({ nullable: true })
  name: string;

  @Column({ type: 'text', nullable: true })
  icon: string;

  @Column({ type: 'text', nullable: true })
  description: string;
}

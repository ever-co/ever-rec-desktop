import type { IScreenshot, IScreenshotMetadata } from '@prototype/shared/utils';
import { Column, Entity, OneToOne, Relation } from 'typeorm';
import { Base } from './base.entity';
import { ScreenshotMetadata } from './screenshot-metadata.entity';

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
}

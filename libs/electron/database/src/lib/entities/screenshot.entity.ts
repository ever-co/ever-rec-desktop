import { IScreenshot, IScreenshotMetadata } from '@prototype/shared/utils';
import { Column, Entity, OneToOne } from 'typeorm';
import { Base } from './base.entity';
import { ScreenshotMetadata } from './screenshot-metadata.entity';

@Entity()
export class Screenshot extends Base implements IScreenshot {
  @Column({ type: 'text', nullable: true })
  pathname: string;

  @Column({ default: false, type: 'boolean' })
  synced: boolean;

  @OneToOne(() => ScreenshotMetadata, (it) => it.screenshot, {
    nullable: true,
  })
  metadata: IScreenshotMetadata;
}

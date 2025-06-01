import { Entity, ManyToOne, JoinColumn, Column, Relation } from 'typeorm';
import { Screenshot } from './screenshot.entity';
import { IScreenshot, IScreenshotUpload } from '@ever-co/shared-utils';
import { UploadBase } from './upload-base.entity';

@Entity('screenshot_uploads')
export class ScreenshotUpload extends UploadBase implements IScreenshotUpload {
  @ManyToOne(() => Screenshot, {
    nullable: true,
    onDelete: 'CASCADE',
  })
  @JoinColumn()
  screenshot?: Relation<IScreenshot>;

  @Column({ nullable: true })
  screenshotId?: IScreenshot['id'];
}

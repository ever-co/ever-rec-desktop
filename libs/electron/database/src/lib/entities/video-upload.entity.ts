import { Entity, ManyToOne, JoinColumn, Column, Relation } from 'typeorm';
import { Video } from './video.entity';
import { IVideo, IVideoUpload } from '@ever-co/shared-utils';
import { UploadBase } from './upload-base.entity';

@Entity('video_uploads')
export class VideoUpload extends UploadBase implements IVideoUpload {
  @ManyToOne(() => Video, {
    nullable: true,
    onDelete: 'CASCADE',
  })
  @JoinColumn()
  video?: Relation<IVideo>;

  @Column({ nullable: true })
  videoId?: IVideo['id'];
}

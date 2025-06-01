import { Entity, ManyToOne, JoinColumn, Column, Relation } from 'typeorm';
import { Audio } from './audio.entity';
import { IAudio, IAudioUpload } from '@ever-co/shared-utils';
import { UploadBase } from './upload-base.entity';

@Entity('audio_uploads')
export class AudioUpload extends UploadBase implements IAudioUpload {
  @ManyToOne(() => Audio, {
    nullable: true,
    onDelete: 'CASCADE',
  })
  @JoinColumn()
  audio?: Relation<IAudio>;

  @Column({ nullable: true })
  audioId?: IAudio['id'];
}

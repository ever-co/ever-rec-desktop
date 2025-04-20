import { Column, Entity, JoinColumn, OneToOne, Relation } from 'typeorm';
import { Base } from './base.entity';
import { IAudio, IAudioMetadata } from '@ever-co/shared-utils';
import { Audio } from './audio.entity';

@Entity('audio_metadata')
export class AudioMetadata extends Base implements IAudioMetadata {
  @Column({ nullable: true, type: 'text' })
  name?: string;

  @Column({ default: 0, type: 'integer' })
  duration?: number;

  @Column({ type: 'bigint', default: 0 })
  size: number;

  @Column({ default: 0, type: 'integer' })
  rate?: number;

  @Column({ default: 0, type: 'integer' })
  channels?: number;

  @OneToOne(() => Audio, (audio) => audio.metadata, {
    onDelete: 'CASCADE',
  })
  @JoinColumn()
  audio?: Relation<IAudio>;

  @Column({ nullable: true })
  audioId?: IAudio['id'];
}

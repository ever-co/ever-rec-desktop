import {
  Column,
  Entity,
  JoinColumn,
  ManyToOne,
  OneToOne,
  Relation,
} from 'typeorm';
import { Base } from './base.entity';
import { IAudio, IAudioMetadata, ITimeLog } from '@ever-co/shared-utils';
import { TimeLog } from './time-log.entity';
import { AudioMetadata } from './audio-metadata.entity';

@Entity('audio')
export class Audio extends Base implements IAudio {
  @Column({ type: 'text', nullable: true })
  pathname: string;

  @Column({ default: false, type: 'boolean' })
  synced?: boolean;

  @OneToOne(() => AudioMetadata, (metadata) => metadata.audio, {
    nullable: true,
    onDelete: 'CASCADE',
  })
  metadata: Relation<IAudioMetadata>;

  @ManyToOne(() => TimeLog, {
    nullable: true,
    onDelete: 'CASCADE',
  })
  @JoinColumn()
  timeLog?: Relation<ITimeLog>;

  @Column({ nullable: true })
  timeLogId?: ITimeLog['id'];
}

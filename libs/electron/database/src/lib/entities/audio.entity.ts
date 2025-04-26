import {
  Column,
  Entity,
  JoinColumn,
  ManyToOne,
  OneToMany,
  OneToOne,
  Relation,
} from 'typeorm';
import { Base } from './base.entity';
import {
  IAudio,
  IAudioMetadata,
  ITimeLog,
  IVideo,
} from '@ever-co/shared-utils';
import { TimeLog } from './time-log.entity';
import { AudioMetadata } from './audio-metadata.entity';
import { Video } from './video.entity';

@Entity('audio')
export class Audio extends Base implements IAudio {
  @Column({ type: 'text', nullable: true })
  pathname: string;

  @Column({ default: false, type: 'boolean' })
  synced?: boolean;

  @ManyToOne(() => Audio, (audio) => audio.chunks, {
    nullable: true,
    onDelete: 'CASCADE',
  })
  @JoinColumn()
  parent?: Relation<IAudio>;

  @OneToMany(() => Audio, (audio) => audio.parent, {
    onDelete: 'CASCADE',
    nullable: true,
  })
  chunks?: Relation<IAudio[]>;

  @OneToOne(() => AudioMetadata, (metadata) => metadata.audio, {
    nullable: true,
    onDelete: 'CASCADE',
  })
  metadata: Relation<IAudioMetadata>;

  @OneToOne(() => Video, (video) => video.audio, {
    nullable: true,
    onDelete: 'CASCADE',
  })
  @JoinColumn()
  video: Relation<IVideo>;

  @ManyToOne(() => TimeLog, {
    nullable: true,
    onDelete: 'CASCADE',
  })
  @JoinColumn()
  timeLog?: Relation<ITimeLog>;

  @Column({ nullable: true })
  timeLogId?: ITimeLog['id'];
}

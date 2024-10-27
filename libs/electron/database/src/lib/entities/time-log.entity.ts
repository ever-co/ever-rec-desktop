import { IScreenshot, ITimeLog, IVideo, TimeLogType } from '@ever-co/shared-utils';
import { Column, Entity, OneToMany, Relation } from 'typeorm';
import { Base } from './base.entity';
import { Screenshot } from './screenshot.entity';
import { Video } from './video.entity';

@Entity('time_log')
export class TimeLog extends Base implements ITimeLog {
  @Column({ type: 'date', nullable: true })
  start: string | Date;

  @Column({ type: 'date', nullable: true })
  end: string | Date;

  @Column({ type: 'text', nullable: true, default: 0 })
  duration: number;

  @Column({ default: false, type: 'boolean' })
  synced: boolean;

  @Column({ default: false, type: 'boolean' })
  running: boolean;

  @Column({ default: TimeLogType.TRACKED, type: 'text' })
  type: TimeLogType;

  @OneToMany(() => Screenshot, (screenshot) => screenshot.timeLog, {
    nullable: true,
    onDelete: 'SET NULL',
  })
  screenshots: Relation<IScreenshot[]>;

  @OneToMany(() => Video, (video) => video.timeLog, {
    nullable: true,
    onDelete: 'SET NULL',
  })
  videos: Relation<IVideo[]>;
}

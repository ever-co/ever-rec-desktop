import {
  IActivity,
  IScreenshot,
  ISession,
  ITimeline,
  ITimeLog,
  IVideo,
  TimeLogType,
} from '@ever-co/shared-utils';
import { Column, Entity, JoinColumn, ManyToOne, OneToMany, Relation } from 'typeorm';
import { Activity } from './activity.entity';
import { Base } from './base.entity';
import { Screenshot } from './screenshot.entity';
import { Timeline } from './timeline.entity';
import { Video } from './video.entity';
import { Session } from './session.entity';

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

  @OneToMany(() => Timeline, (timeline) => timeline.video, {
    nullable: true,
    onDelete: 'SET NULL',
  })
  timelines?: Relation<ITimeline[]>;

  @OneToMany(() => Video, (video) => video.timeLog, {
    nullable: true,
    onDelete: 'SET NULL',
  })
  videos: Relation<IVideo[]>;

  @OneToMany(() => Activity, (activity) => activity.timeLog, {
    nullable: true,
    onDelete: 'SET NULL',
  })
  activities: Relation<IActivity[]>;

  @ManyToOne(() => Session, {
    nullable: true,
    onDelete: 'CASCADE',
  })
  @JoinColumn()
  session?: Relation<ISession>;
}

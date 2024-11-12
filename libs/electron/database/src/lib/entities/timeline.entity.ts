import type { ITimeline, ITimeLog, IVideo } from '@ever-co/shared-utils';
import { Column, Entity, JoinColumn, ManyToOne, Relation } from 'typeorm';
import { Base } from './base.entity';
import { TimeLog } from './time-log.entity';
import { Video } from './video.entity';

@Entity('timeline')
export class Timeline extends Base implements ITimeline {
  @ManyToOne(() => Video, (video) => video.timelines, {
    nullable: true,
    onDelete: 'CASCADE',
  })
  @JoinColumn()
  video?: Relation<IVideo>;

  @Column()
  videoId?: IVideo['id'];

  @ManyToOne(() => TimeLog, (timeLog) => timeLog.timelines, {
    nullable: true,
    onDelete: 'CASCADE',
  })
  @JoinColumn()
  timeLog?: Relation<ITimeLog>;

  @Column()
  timeLogId?: ITimeLog['id'];
}

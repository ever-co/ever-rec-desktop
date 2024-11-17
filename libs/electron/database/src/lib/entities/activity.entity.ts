import type { IActivity, IdleState, ITimeLog } from '@ever-co/shared-utils';
import { Column, Entity, JoinColumn, ManyToOne, Relation } from 'typeorm';
import { Base } from './base.entity';
import { TimeLog } from './time-log.entity';

@Entity('activities')
export class Activity extends Base implements IActivity {
  @Column()
  duration: number;

  @Column({ type: 'text' })
  state: IdleState;

  @ManyToOne(() => TimeLog, (timeLog) => timeLog.activities, {
    nullable: true,
    onDelete: 'CASCADE',
  })
  @JoinColumn()
  timeLog: Relation<ITimeLog>;

  @Column()
  timeLogId: ITimeLog['id'];
}

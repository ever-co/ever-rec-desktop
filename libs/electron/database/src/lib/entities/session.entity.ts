import { Column, Entity, JoinColumn, ManyToOne, OneToMany, Relation } from 'typeorm';
import type { ISession, ITimeLog, IUser } from '@ever-co/shared-utils';
import { Base } from './base.entity';
import { User } from './user.entity';
import { TimeLog } from './time-log.entity';

@Entity('sessions')
export class Session extends Base implements ISession {
  @ManyToOne(() => User, {
    nullable: true,
    onDelete: 'CASCADE',
  })
  @JoinColumn()
  user: Relation<IUser>;

  @OneToMany(() => TimeLog, (timeLog) => timeLog.session, {
    nullable: true,
    onDelete: 'SET NULL',
  })
  timeLogs: Relation<ITimeLog[]>

  @Column({ type: 'datetime', default: () => 'CURRENT_TIMESTAMP' })
  loginAt: string;

  @Column({ type: 'datetime', nullable: true })
  logoutAt: string;
}

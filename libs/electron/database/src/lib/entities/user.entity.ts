import { Column, Entity, Index } from 'typeorm';
import type { IUserPersistance } from '@ever-co/shared-utils';
import { Base } from './base.entity';

@Entity('users')
export class User extends Base implements IUserPersistance {
  @Index({ unique: true })
  @Column({ type: 'varchar', length: 255, nullable: false })
  email: string;

  @Index({ unique: true })
  @Column({ type: 'uuid' })
  remoteId: string;

  @Column({ type: 'datetime', nullable: true })
  lastLoginAt: string;
}

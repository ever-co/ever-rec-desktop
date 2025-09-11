import { Column, Entity, Index } from 'typeorm';
import type { IUserPersistance } from '@ever-co/shared-utils';
import { Base } from './base.entity';

@Entity('users')
export class User extends Base implements IUserPersistance {
  @Column({ type: 'varchar', length: 150, nullable: false })
  name: string;

  @Index({ unique: true })
  @Column({ type: 'varchar', length: 255, nullable: false })
  email: string;

  @Index({ unique: true })
  @Column({ type: 'uuid' })
  remoteId: string;

  @Column({ type: 'varchar', length: 500, nullable: true })
  imageUrl?: string;

  @Column({ type: 'boolean', default: false, nullable: false })
  isVerified: boolean;
}

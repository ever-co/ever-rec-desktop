import { Column, Entity } from 'typeorm';
import { Base } from './base.entity';

@Entity()
export class Screenshot extends Base {
  @Column({ type: 'text', nullable: true })
  pathname: string;

  @Column({ default: false, type: 'boolean' })
  synced: boolean;
}

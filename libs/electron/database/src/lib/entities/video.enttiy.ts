import type { IScreenshot, IVideo } from '@prototype/shared/utils';
import { Column, Entity, ManyToOne, OneToMany, Relation } from 'typeorm';
import { Base } from './base.entity';
import { Screenshot } from './screenshot.entity';

@Entity()
export class Video extends Base implements IVideo {
  @Column({ type: 'text', nullable: true })
  pathname: string;

  @Column({ default: false, type: 'boolean' })
  synced?: boolean;

  @Column({ default: '15', type: 'integer' })
  frameRate?: number;

  @Column({ default: '1920:1080', type: 'text' })
  resolution?: string;

  @Column({ default: 0, type: 'integer' })
  duration?: number;

  @ManyToOne(() => Video, (video) => video.chunks, { nullable: true })
  parent?: Relation<IVideo>;

  @OneToMany(() => Video, (video) => video.parent, {
    onDelete: 'CASCADE',
    nullable: true,
  })
  chunks?: Relation<IVideo[]>;

  @OneToMany(() => Screenshot, (screenshot) => screenshot.video, {
    nullable: true,
  })
  screenshots?: Relation<IScreenshot[]>;
}

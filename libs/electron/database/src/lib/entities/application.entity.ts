import type {
  IScreenshotMetadata
} from '@ever-co/shared-utils';
import { IApplication } from 'libs/shared/utils/src/lib/interfaces/application.interface';
import {
  Column,
  Entity,
  OneToMany,
  Relation
} from 'typeorm';
import { Base } from './base.entity';
import { ScreenshotMetadata } from './screenshot-metadata.entity';

@Entity('application')
export class Application extends Base implements IApplication {
  @Column({ type: 'text', nullable: false, unique: true })
  name: string;

  @Column({ type: 'text', nullable: true })
  icon: string;

  @OneToMany(() => ScreenshotMetadata, (metadata) => metadata.application, {
    nullable: true,
    onDelete: 'SET NULL',
  })
  metadatas: Relation<IScreenshotMetadata[]>;
}

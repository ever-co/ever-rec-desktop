import { IPhoto, IPhotoMetadata, Resolution } from '@ever-co/shared-utils';
import { Column, Entity, JoinColumn, OneToOne, Relation } from 'typeorm';
import { Base } from './base.entity';
import { Photo } from './photo.entity';

@Entity('photo_metadata')
export class PhotoMetadata extends Base implements IPhotoMetadata {
  @Column({ nullable: true, type: 'text' })
  name?: string;

  @Column({ default: Resolution.MEDIUM, enum: Resolution, type: 'simple-enum' })
  resolution?: Resolution;

  @Column({ type: 'bigint', default: 0 })
  size: number;

  @OneToOne(() => Photo, (photo) => photo.metadata, {
    onDelete: 'CASCADE',
  })
  @JoinColumn()
  photo?: Relation<IPhoto>;

  @Column({ nullable: true })
  photoId?: IPhoto['id'];
}

import { Entity, ManyToOne, JoinColumn, Column, Relation } from 'typeorm';
import { Photo } from './photo.entity';
import { IPhoto, IPhotoUpload } from '@ever-co/shared-utils';
import { UploadBase } from './upload-base.entity';

@Entity('photo_uploads')
export class PhotoUpload extends UploadBase implements IPhotoUpload {
  @ManyToOne(() => Photo, {
    nullable: true,
    onDelete: 'CASCADE',
  })
  @JoinColumn()
  photo?: Relation<IPhoto>;

  @Column({ nullable: true })
  photoId?: IPhoto['id'];
}

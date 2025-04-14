import {
  IPhoto,
  IPhotoCreateInput,
  IPhotoInput,
  IPhotoService,
} from '@ever-co/shared-utils';
import { FindManyOptions, FindOneOptions, In } from 'typeorm';
import { Photo } from '../entities/photo.entity';
import { PhotoRepository } from '../repositories/photo.repository';
import { PhotoMetadataService } from './photo-metadata.service';

export class PhotoService implements IPhotoService {
  private readonly repository = PhotoRepository.instance;
  private readonly photoMetadataService = new PhotoMetadataService();

  public async save(input: IPhotoCreateInput): Promise<IPhoto> {
    const photo = new Photo();
    photo.pathname = input.pathname;
    photo.timeLogId = input.timeLogId;
    const metadata = await this.photoMetadataService.save(input.metadata);
    photo.metadata = metadata;
    const { id } = await this.repository.save(photo);
    return this.findOne({ where: { id }, relations: ['metadata'] });
  }

  public async update(
    id: string,
    input: Partial<IPhotoInput>
  ): Promise<IPhoto> {
    await this.repository.update({ id }, input);
    return this.findOneById(id);
  }

  public findAll(options: FindManyOptions<IPhoto>): Promise<IPhoto[]> {
    return this.repository.find(options);
  }

  public findOne(options: FindOneOptions<IPhoto>): Promise<IPhoto> {
    return this.repository.findOne(options);
  }

  public findAndCount(
    options: FindManyOptions<IPhoto>
  ): Promise<[IPhoto[], number]> {
    return this.repository.findAndCount(options);
  }
  public findOneById(id: string): Promise<IPhoto> {
    return this.repository.findOneBy({ id });
  }

  public async delete(id: string): Promise<void> {
    await this.repository.delete({ id });
  }

  public async deleteAll(videoIds?: string[]): Promise<void> {
    await this.repository.delete(videoIds ? { id: In(videoIds) } : {});
  }
}

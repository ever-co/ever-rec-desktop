import {
  IPhotoMetadata,
  IPhotoMetadataInput,
  IPhotoMetadataService,
} from '@ever-co/shared-utils';
import { PhotoMetadata } from '../entities/metadata.entity';
import { PhotoMetadataRepository } from '../repositories/photo-metadata.repository';

export class PhotoMetadataService implements IPhotoMetadataService {
  private readonly repository = PhotoMetadataRepository.instance;

  public save(input: IPhotoMetadataInput): Promise<IPhotoMetadata> {
    const metadata = new PhotoMetadata();
    metadata.name = input.name;
    metadata.resolution = input.resolution;
    metadata.size = input.size;
    return this.repository.save(metadata);
  }

  public async update(
    id: string,
    input: Partial<IPhotoMetadataInput>
  ): Promise<IPhotoMetadata> {
    await this.repository.update({ id }, input);
    return this.repository.findOneBy({ id });
  }
}

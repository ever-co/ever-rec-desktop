import {
  IAudioMetadataService,
  IAudioMetadataInput,
  IAudioMetadata,
} from '@ever-co/shared-utils';
import { AudioMetadataRepository } from '../repositories/audio-metadata.repository';
import { AudioMetadata } from '../entities/audio-metadata.entity';

export class AudioMetadataService implements IAudioMetadataService {
  private readonly repository = AudioMetadataRepository.instance;

  public save(input: IAudioMetadataInput): Promise<IAudioMetadata> {
    const metadata = new AudioMetadata();
    metadata.name = input.name;
    metadata.size = input.size;
    metadata.duration = input.duration;
    return this.repository.save(metadata);
  }

  public async update(
    id: string,
    input: Partial<IAudioMetadataInput>
  ): Promise<IAudioMetadata> {
    await this.repository.update({ id }, input);
    return this.repository.findOneBy({ id });
  }
}

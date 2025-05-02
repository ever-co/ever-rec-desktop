import {
  IAudio,
  IAudioCreateInput,
  IAudioInput,
  IAudioService,
  IFindManyOptions,
  IFindOneOptions,
} from '@ever-co/shared-utils';
import { AudioRepository } from '../repositories/audio.repository';
import { AudioMetadataService } from './audio-metadata.service';
import { Audio } from '../entities/audio.entity';
import { In } from 'typeorm';

export class AudioService implements IAudioService {
  private readonly repository = AudioRepository.instance;
  private readonly audioMetadataService = new AudioMetadataService();

  public async save(input: IAudioCreateInput): Promise<IAudio> {
    const audio = new Audio();
    audio.pathname = input.pathname;
    audio.timeLogId = input.timeLogId;
    if (input.videoId) {
      audio.videoId = input.videoId;
    }
    const metadata = await this.audioMetadataService.save(input.metadata);
    audio.metadata = metadata;
    const { id } = await this.repository.save(audio);
    return this.findOne({ where: { id }, relations: ['metadata'] });
  }

  public async update(
    id: string,
    input: Partial<IAudioInput>
  ): Promise<IAudio> {
    await this.repository.update({ id }, input);
    return this.findOneById(id);
  }

  public findAll(options: IFindManyOptions<IAudio>): Promise<IAudio[]> {
    return this.repository.find(options);
  }

  public findOne(options: IFindOneOptions<IAudio>): Promise<IAudio> {
    return this.repository.findOne(options);
  }

  public findAndCount(
    options: IFindManyOptions<IAudio>
  ): Promise<[IAudio[], number]> {
    return this.repository.findAndCount(options);
  }
  public findOneById(id: string): Promise<IAudio> {
    return this.repository.findOneBy({ id });
  }

  public async delete(id: string): Promise<void> {
    await this.repository.delete({ id });
  }

  public async deleteAll(audioIds?: string[]): Promise<void> {
    await this.repository.delete(audioIds ? { id: In(audioIds) } : {});
  }
}

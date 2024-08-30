import { IChunk } from '@ever-capture/shared-utils';
import { ChunkRepository } from '../repositories/chunk.repository';

export class ChunkService {
  private readonly repository = new ChunkRepository();

  public async save(chunk: Partial<IChunk>): Promise<IChunk> {
    return this.repository.save(chunk);
  }

  public async findAll(options): Promise<IChunk[]> {
    return this.repository.findAll(options);
  }

  public async update(id: string, chunk: any): Promise<IChunk> {
    await this.repository.update(id, chunk);
    return this.findOneById(id);
  }

  public async findOne(options): Promise<IChunk> {
    return this.repository.findOne(options);
  }

  public async findOneById(id: string): Promise<IChunk> {
    return this.repository.findOneById(id);
  }

  public async delete(id: string): Promise<void> {
    await this.repository.delete(id);
  }

  public async deleteAll(chunkIds?: string[]): Promise<void> {
    await this.repository.deleteAll(chunkIds);
  }
}

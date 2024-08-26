export interface IChunk {
  id: string;
  videoId: string;
  screenshotId: string;
}

export interface IChunkService {
  save(input: IChunk): Promise<IChunk>;
  findAll<T>(options: T): Promise<IChunk[]>;
  update(id: string, chunk: Partial<IChunk>): Promise<IChunk>;
  findOne<T>(options: T): Promise<IChunk>;
  findOneById(id: string): Promise<IChunk>;
  delete(id: string): Promise<void>;
  deleteAll(chunkIds?: string[]): Promise<void>;
}

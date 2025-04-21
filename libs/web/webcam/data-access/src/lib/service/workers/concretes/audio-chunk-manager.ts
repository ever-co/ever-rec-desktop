export class AudioChunkManager {
  private chunks: BlobPart[] = [];

  public addChunk(chunk: BlobPart): void {
    this.chunks.push(chunk);
  }

  public clearChunks(): void {
    this.chunks = [];
  }

  public getChunks(): BlobPart[] {
    return [...this.chunks]; // Return immutable copy
  }
}

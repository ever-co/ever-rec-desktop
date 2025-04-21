export interface AudioProcessor {
  process(chunks: BlobPart[]): Promise<ArrayBuffer>;
}

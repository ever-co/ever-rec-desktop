export interface ISplitterStrategy {
  split(arr: string[], batchSize: number): string[][];
}

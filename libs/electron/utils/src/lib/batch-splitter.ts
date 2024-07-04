import { ISplitterStrategy } from './interfaces/splitter-strategy.interface';

export class BatchSplitter implements ISplitterStrategy {
  split(arr: string[], batchSize: number): string[][] {
    const batches: string[][] = [];
    for (let i = 0; i < arr.length; i += batchSize) {
      batches.push(arr.slice(i, i + batchSize));
    }
    return batches;
  }
}

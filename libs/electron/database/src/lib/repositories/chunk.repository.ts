import { IVideo } from '@ever-capture/shared-utils';
import { Repository } from './repository';

export const chunkTable = 'chunk';

export class ChunkRepository extends Repository<IVideo> {
  constructor() {
    super(chunkTable);
  }
}

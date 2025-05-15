import { IEnvironment } from '@ever-co/shared-utils';
import {
  DataProcessingFactory,
  DataProcessingStrategy,
} from '../models/data-processing.strategy';
import { DailyDataWorkerStrategy } from '../strategies/daily-data-worker.strategy';
import { DailyDataStrategy } from '../strategies/daily-data.strategy';

export class DailyDataFactory implements DataProcessingFactory {
  constructor(private readonly env: IEnvironment) {}

  public createStrategy(): DataProcessingStrategy {
    if (typeof Worker !== 'undefined' && this.env.canUseWebWorker) {
      try {
        return new DailyDataWorkerStrategy();
      } catch (error) {
        console.warn('Failed to initialize daily worker:', error);
        return new DailyDataStrategy();
      }
    } else {
      console.warn('Web Workers are not supported in this environment');
      return new DailyDataStrategy();
    }
  }
}

import { IEnvironment } from '@ever-co/shared-utils';
import {
  DataProcessingFactory,
  DataProcessingStrategy,
} from '../models/data-processing.strategy';
import { HourlyDataWorkerStrategy } from '../strategies/hourly-data-worker.strategy';
import { HourlyDataStrategy } from '../strategies/hourly-data.strategy';

export class HourlyDataFactory implements DataProcessingFactory {
  constructor(private readonly env: IEnvironment) {}

  public createStrategy(): DataProcessingStrategy {
    if (typeof Worker !== 'undefined' && this.env.canUseWebWorker) {
      try {
        return new HourlyDataWorkerStrategy();
      } catch (error) {
        console.warn('Failed to initialize hourly worker:', error);
        return new HourlyDataStrategy();
      }
    } else {
      console.warn('Web Workers are not supported in this environment');
      return new HourlyDataStrategy();
    }
  }
}

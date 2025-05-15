import { IEnvironment } from '@ever-co/shared-utils';
import {
  DataProcessingFactory,
  DataProcessingStrategy,
} from '../models/data-processing.strategy';
import { MonthlyDataWorkerStrategy } from '../strategies/monthly-data-worker.strategy';
import { MonthlyDataStrategy } from '../strategies/monthly-data.strategy';

export class MonthlyDataFactory implements DataProcessingFactory {
  constructor(private readonly env: IEnvironment) {}

  public createStrategy(): DataProcessingStrategy {
    if (typeof Worker !== 'undefined' && this.env.canUseWebWorker) {
      try {
        return new MonthlyDataWorkerStrategy();
      } catch (error) {
        console.warn('Failed to initialize monthly worker:', error);
        return new MonthlyDataStrategy();
      }
    } else {
      console.warn('Web Workers are not supported in this environment');
      return new MonthlyDataStrategy();
    }
  }
}

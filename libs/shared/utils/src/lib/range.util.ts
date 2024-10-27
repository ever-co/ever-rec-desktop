import { IRange } from './interfaces/pagination.interface';
import { moment } from './moment.util';

export function currentDay(): IRange {
  return {
    start: moment().startOf('day').toISOString(),
    end: moment().endOf('day').toISOString(),
  };
}

export function yesterday(): IRange {
  return {
    start: moment().subtract(1, 'days').startOf('day').toISOString(),
    end: moment().subtract(1, 'days').endOf('day').toISOString(),
  };
}

export function currentWeek(): IRange {
  return {
    start: moment().startOf('week').toISOString(),
    end: moment().endOf('week').toISOString(),
  };
}

export function currentMonth(): IRange {
  return {
    start: moment().startOf('month').toISOString(),
    end: moment().endOf('month').toISOString(),
  };
}

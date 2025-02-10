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

/**
 * Determines the interval of a date range as 'daily', 'weekly', or 'monthly'.
 *
 * @param startDate - The start date in ISO format (e.g., '2024-02-01T10:00:00').
 * @param endDate - The end date in ISO format (e.g., '2024-02-02T09:00:00').
 * @returns The interval as 'daily', 'weekly', or 'monthly'.
 * @throws Will throw an error if the dates are invalid or if the start date is after the end date.
 */
export function getDateRangeInterval(
  range: IRange
): 'daily' | 'weekly' | 'monthly' {
  const start = moment(range.start, moment.ISO_8601, true);
  const end = moment(range.end, moment.ISO_8601, true);

  // Validate dates
  if (!start.isValid() || !end.isValid()) {
    throw new Error('Invalid date format. Please provide dates in ISO format.');
  }

  if (start.isAfter(end)) {
    throw new Error('Start date must be before end date.');
  }

  const durationInDays = end.diff(start, 'days', true); // true for fractional days

  if (durationInDays <= 1) return 'daily';
  if (durationInDays <= 7) return 'weekly';

  return 'monthly';
}

import { ITimeLog, moment } from '@ever-co/shared-utils';

export class DateService {
  static getDayName(momentDate: moment.Moment): string {
    return momentDate.format('dddd'); // Returns full day name (Monday, Tuesday, etc.)
  }

  static formatHourLabel(hour: number): string {
    return moment().hour(hour).minute(0).format('h A'); // Format as '1 AM', '2 PM', etc.
  }

  static formatDateLabel(momentDate: moment.Moment): string {
    return momentDate.format('MM/DD'); // Format as month/day
  }

  static durationToHours(duration: number): number {
    return moment.duration(duration, 'seconds').asHours();
  }

  static calculateDateRange(logs: ITimeLog[]): {
    start: moment.Moment;
    end: moment.Moment;
  } {
    if (!logs || logs.length === 0) {
      const now = moment();
      return { start: now, end: now };
    }

    // Get all valid start dates as moment objects
    const dates = logs
      .filter((log) => log.start)
      .map((log) => moment(log.start));

    // Find min and max dates
    return {
      start: moment.min(dates),
      end: moment.max(dates),
    };
  }

  static isDateRangeMoreThanWeek(
    start: moment.Moment,
    end: moment.Moment,
  ): boolean {
    return end.diff(start, 'days') > 7;
  }
}

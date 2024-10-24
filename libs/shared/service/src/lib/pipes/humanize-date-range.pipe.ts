import { Pipe, PipeTransform } from '@angular/core';
import { IRange } from '@ever-co/shared-utils';
import moment from 'moment';

interface DateCheck {
  condition: (start: moment.Moment, end: moment.Moment, reference: moment.Moment) => boolean;
  label: string | ((start: moment.Moment, end: moment.Moment) => string);
}

@Pipe({
  name: 'humanizeDateRange',
  standalone: true,
  pure: true
})
export class HumanizeDateRangePipe implements PipeTransform {
  private readonly dateChecks: DateCheck[] = [
    // Today and Yesterday
    {
      condition: (s, e, today) => s.isSame(today, 'day') && e.isSame(today, 'day'),
      label: 'Today'
    },
    {
      condition: (s, e, today) => {
        const yesterday = today.clone().subtract(1, 'days');
        return s.isSame(yesterday, 'day') && e.isSame(yesterday, 'day');
      },
      label: 'Yesterday'
    },
    {
      condition: (s, e, today) => {
        const tomorrow = today.clone().add(1, 'days');
        return s.isSame(tomorrow, 'day') && e.isSame(tomorrow, 'day');
      },
      label: 'Tomorrow'
    },

    // Current Week
    {
      condition: (s, e, today) => s.isSame(today, 'week') && e.isSame(today, 'week'),
      label: (s, e) => this.formatDateRangeInWeek(s, e)
    },

    // Last Week
    {
      condition: (s, e, today) => {
        const lastWeek = today.clone().subtract(1, 'week');
        return s.isSame(lastWeek, 'week') && e.isSame(lastWeek, 'week');
      },
      label: 'Last week'
    },

    // Next Week
    {
      condition: (s, e, today) => {
        const nextWeek = today.clone().add(1, 'week');
        return s.isSame(nextWeek, 'week') && e.isSame(nextWeek, 'week');
      },
      label: 'Next week'
    },

    // Current Month
    {
      condition: (s, e, today) => s.isSame(today, 'month') && e.isSame(today, 'month'),
      label: (s, e) => this.formatDateRangeInMonth(s, e)
    },

    // Last Month
    {
      condition: (s, e, today) => {
        const lastMonth = today.clone().subtract(1, 'month');
        return s.isSame(lastMonth, 'month') && e.isSame(lastMonth, 'month');
      },
      label: (s, e) => `Last month (${s.format('MMMM')})`
    },

    // Next Month
    {
      condition: (s, e, today) => {
        const nextMonth = today.clone().add(1, 'month');
        return s.isSame(nextMonth, 'month') && e.isSame(nextMonth, 'month');
      },
      label: (s, e) => `Next month (${s.format('MMMM')})`
    },

    // Last 3 Months
    {
      condition: (s, e, today) => {
        const threeMonthsAgo = today.clone().subtract(3, 'months');
        return s.isSame(threeMonthsAgo, 'month') && e.isSame(today, 'month');
      },
      label: (s, e) => `Last 3 months (${s.format('MMM')} - ${e.format('MMM')})`
    },

    // Next 3 Months
    {
      condition: (s, e, today) => {
        const threeMonthsLater = today.clone().add(3, 'months');
        return s.isSame(today, 'month') && e.isSame(threeMonthsLater, 'month');
      },
      label: (s, e) => `Next 3 months (${s.format('MMM')} - ${e.format('MMM')})`
    },

    // Current Year
    {
      condition: (s, e, today) => s.isSame(today, 'year') && e.isSame(today, 'year'),
      label: (s, e) => this.formatDateRangeInYear(s, e)
    },

    // Same Day (past or future)
    {
      condition: (s, e) => s.isSame(e, 'day'),
      label: (s) => this.formatSingleDay(s)
    }
  ];

  transform(range: IRange | null): string {
    if (!range) {
      return 'Select date range';
    }

    const start = moment(range.start);
    const end = moment(range.end);

    if (!this.isValidDateRange(start, end)) {
      return 'Invalid date range';
    }

    if (end.isBefore(start)) {
      return 'End date cannot be before start date';
    }

    const today = moment();

    // Find matching date check
    const matchingCheck = this.dateChecks.find(check =>
      check.condition(start, end, today)
    );

    if (matchingCheck) {
      return typeof matchingCheck.label === 'function'
        ? matchingCheck.label(start, end)
        : matchingCheck.label;
    }

    // Handle custom ranges that don't match predefined patterns
    return this.formatCustomDateRange(start, end);
  }

  private isValidDateRange(start: moment.Moment, end: moment.Moment): boolean {
    return start.isValid() && end.isValid();
  }

  private formatSingleDay(date: moment.Moment): string {
    const today = moment();
    const tomorrow = moment().add(1, 'day');
    const yesterday = moment().subtract(1, 'day');

    if (date.isSame(today, 'day')) return 'Today';
    if (date.isSame(tomorrow, 'day')) return 'Tomorrow';
    if (date.isSame(yesterday, 'day')) return 'Yesterday';

    const diffDays = date.diff(today, 'days');
    if (diffDays > 0) {
      return `In ${diffDays} ${diffDays === 1 ? 'day' : 'days'} (${date.format('MMM D')})`;
    } else {
      return `${Math.abs(diffDays)} ${Math.abs(diffDays) === 1 ? 'day' : 'days'} ago (${date.format('MMM D')})`;
    }
  }

  private formatDateRangeInWeek(start: moment.Moment, end: moment.Moment): string {
    if (start.isSame(end, 'day')) {
      return this.formatSingleDay(start);
    }
    return `This week (${start.format('MMM D')} - ${end.format('MMM D')})`;
  }

  private formatDateRangeInMonth(start: moment.Moment, end: moment.Moment): string {
    if (start.isSame(end, 'day')) {
      return this.formatSingleDay(start);
    }
    return `This month (${start.format('MMM D')} - ${end.format('MMM D')})`;
  }

  private formatDateRangeInYear(start: moment.Moment, end: moment.Moment): string {
    if (start.isSame(end, 'month')) {
      return `${start.format('MMMM YYYY')}`;
    }
    return `${start.format('MMM')} - ${end.format('MMM')} ${start.format('YYYY')}`;
  }

  private formatCustomDateRange(start: moment.Moment, end: moment.Moment): string {
    const today = moment();
    const diffStartDays = start.diff(today, 'days');
    const diffEndDays = end.diff(today, 'days');
    const duration = moment.duration(end.diff(start));

    // Handle future dates
    if (diffStartDays > 0 && diffEndDays > 0) {
      if (duration.asMonths() >= 1) {
        return `Next ${Math.floor(duration.asMonths())} months (${start.format('MMM D')} - ${end.format('MMM D, YYYY')})`;
      }
      return `Next ${duration.asDays()} days (${start.format('MMM D')} - ${end.format('MMM D, YYYY')})`;
    }

    // Handle past dates
    if (diffStartDays < 0 && diffEndDays < 0) {
      if (duration.asMonths() >= 1) {
        return `Past ${Math.floor(duration.asMonths())} months (${start.format('MMM D')} - ${end.format('MMM D, YYYY')})`;
      }
      return `Past ${duration.asDays()} days (${start.format('MMM D')} - ${end.format('MMM D, YYYY')})`;
    }

    // Handle ranges that span past and future
    return `${start.format('MMM D, YYYY')} - ${end.format('MMM D, YYYY')}`;
  }
}

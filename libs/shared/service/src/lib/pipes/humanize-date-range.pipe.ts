import { Pipe, PipeTransform } from '@angular/core';
import { IRange } from '@ever-co/shared-utils';
import moment from 'moment';

@Pipe({
  name: 'humanizeDateRange',
  standalone: true,
})
export class HumanizeDateRangePipe implements PipeTransform {
  transform(range: IRange): string {
    const start = moment(range.start);
    const end = moment(range.end);

    // Validate dates
    if (!start.isValid() || !end.isValid()) {
      return 'Invalid date range';
    }

    if (end.isBefore(start)) {
      return 'End date cannot be before start date';
    }

    const today = moment();
    const yesterday = moment().subtract(1, 'days');

    // Check for today
    if (start.isSame(today, 'day') && end.isSame(today, 'day')) {
      return 'Today';
    }

    // Check for yesterday
    if (start.isSame(yesterday, 'day') && end.isSame(yesterday, 'day')) {
      return 'Yesterday';
    }

    // Check for current week
    if (start.isSame(today, 'week') && end.isSame(today, 'week')) {
      return 'In this week';
    }

    // Check for current month
    if (start.isSame(today, 'month') && end.isSame(today, 'month')) {
      return 'In this month';
    }

    // Check for current year
    if (start.isSame(today, 'year') && end.isSame(today, 'year')) {
      return 'In this year';
    }

    // Handle same day
    if (start.isSame(end, 'day')) {
      return 'That day';
    }

    return 'A long time ago';
  }
}

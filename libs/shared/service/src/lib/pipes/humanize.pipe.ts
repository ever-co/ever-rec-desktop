import { Pipe, PipeTransform } from '@angular/core';
import moment from 'moment';
import 'moment-duration-format';

@Pipe({
  name: 'humanize',
  standalone: true,
})
export class HumanizePipe implements PipeTransform {
  transform(
    value: string | number | null,
    unit: moment.DurationInputArg2,
    format?: any
  ): string {
    const duration = moment.duration(value, unit);
    return format ? duration.format(format, { trim: false, trunc: true }) : duration.humanize();
  }
}

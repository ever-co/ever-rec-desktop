import { Pipe, PipeTransform } from '@angular/core';
import { moment } from '@ever-co/shared-utils';
import 'moment-duration-format';

@Pipe({
  name: 'humanize',
  standalone: true,
})
export class HumanizePipe implements PipeTransform {
  transform(
    value: string | number | null | undefined,
    unit: moment.DurationInputArg2,
    format?: string | moment.TemplateFunction
  ): string {
    const duration = moment.duration(value, unit);
    return format ? duration.format(format, { trim: false, trunc: true }) : duration.humanize();
  }
}

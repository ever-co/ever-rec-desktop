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
    format?: string | moment.TemplateFunction,
    options?: { trim?: boolean; trunc?: boolean }
  ): string {
    const { trim = false, trunc = true } = options || {};
    const duration = moment.duration(value, unit) as any;
    return format
      ? duration.format(format, { trim, trunc })
      : duration.humanize();
  }
}

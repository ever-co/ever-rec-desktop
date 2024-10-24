import { Pipe, PipeTransform } from '@angular/core';
import moment from 'moment';

@Pipe({
  name: 'humanize',
  standalone: true,
})
export class HumanizePipe implements PipeTransform {
  transform(value: string | number | null, unit: moment.DurationInputArg2): string {
    return moment.duration(value, unit).humanize();
  }
}

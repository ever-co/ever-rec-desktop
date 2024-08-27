import { Pipe, PipeTransform } from '@angular/core';
import * as moment from 'moment-timezone';

@Pipe({
  name: 'utcToLocalTime',
  standalone: true,
})
export class UtcToLocalTimePipe implements PipeTransform {
  transform(date: string | Date | undefined, format = 'lll'): string {
    if (!date) return '';

    try {
      // Convert input to moment object; handle both string and Date inputs
      const utcDate = moment.utc(date);

      if (!utcDate.isValid()) return '';

      // Get the user's timezone
      const timezone = moment.tz.guess();

      // Convert UTC date to the guessed timezone and format it
      return utcDate.tz(timezone).format(format);
    } catch (error) {
      console.error('Error in UtcToLocalTimePipe:', error);
      return '';
    }
  }
}

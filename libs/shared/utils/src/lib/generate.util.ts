import { IRange } from './interfaces/pagination.interface';
import { moment } from './moment.util';

export function generateVideoName(range?: IRange): string {
  // Return a generic title if range is missing
  if (!range?.start || !range?.end) {
    return `Video recorded on ${moment().format('MMMM D YYYY, h:mm A')}`;
  }

  const start = moment(range.start);
  const end = moment(range.end);

  // Format start and end times
  const startTime = start.format('h:mm A'); // e.g., 10:30 AM
  const endTime = end.format('h:mm A'); // e.g., 10:35 AM
  const date = start.format('MMMM D YYYY'); // Shared date

  // Generate human-readable title
  const duration = start.isSame(end, 'minute')
    ? `${startTime} on ${date}` // Same minute
    : `${startTime} to ${endTime} on ${date}`; // Different times

  return `Video from ${duration}`;
}

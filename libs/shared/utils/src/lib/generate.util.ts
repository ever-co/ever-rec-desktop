import { IRange } from './interfaces/pagination.interface';
import { moment } from './moment.util';

export function generateVideoName(range?: IRange): string {
  // Return a generic title if range is missing
  if (!range?.start || !range?.end) {
    const fallbackTimestamp = moment().format('MMMM D YYYY h-mm A');
    return `Video recorded on ${fallbackTimestamp}`.replace(/[^a-zA-Z0-9\s-]/g, '');
  }

  const start = moment(range.start);
  const end = moment(range.end);

  // Format start and end times
  const startTime = start.format('h-mm A'); // e.g., 10-30 AM
  const endTime = end.format('h-mm A'); // e.g., 10-35 AM
  const date = start.format('MMMM D YYYY'); // e.g., January 6 2025

  // Generate human-readable duration
  const duration = start.isSame(end, 'minute')
    ? `${startTime} on ${date}` // Same minute
    : `${startTime} to ${endTime} on ${date}`; // Different times

  // Remove invalid characters and return
  return `Video from ${duration}`.replace(/[^a-zA-Z0-9\s-]/g, '');
}

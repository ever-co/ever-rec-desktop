import { IRange } from './interfaces/pagination.interface';
import { moment } from './moment.util';

export function generateVideoName(id: string, range: IRange): string {
  if (!id || !range || !range.start || !range.end) {
    throw new Error('Invalid input: id, start date, and end date are required');
  }

  const start = moment(range.start);
  const end = moment(range.end);

  const startFormatted = start.format('MMMM Do, YYYY');
  const endFormatted = end.format('MMMM Do, YYYY');

  const duration = start.isSame(end, 'day')
    ? startFormatted
    : `${startFormatted} to ${endFormatted}`;

  return `Video #${id} (${duration})`;
}

import { IRange } from './interfaces/pagination.interface';
import { moment } from './moment.util';

export function generateVideoName(range?: IRange): string {

  if (!range || !range.start || !range.end) {
    return `Video #${crypto.randomUUID()}`;
  }

  const start = moment(range.start);
  const end = moment(range.end);

  const startFormatted = start.format('MMMM Do, YYYY');
  const endFormatted = end.format('MMMM Do, YYYY');

  const duration = start.isSame(end, 'day')
    ? startFormatted
    : `${startFormatted} to ${endFormatted}`;

  return `Video #${crypto.randomUUID()} (${duration})`;
}

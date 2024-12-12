import { IFindOptionsWhere } from './base.interface';

export interface IPaginationOptions<T> extends Partial<IRange> {
  page?: number;
  limit?: number;
  sortField?: string;
  sortOrder?: 'ASC' | 'DESC';
  filter?: string;
  where?: IFindOptionsWhere<T>;
  ignoreRange?: boolean;
  deleted?: boolean;
}

export interface IRange {
  start: Date | string;
  end: Date | string;
}
export interface IPaginationResponse<T> {
  data: T[];
  count: number;
  hasNext: boolean;
}

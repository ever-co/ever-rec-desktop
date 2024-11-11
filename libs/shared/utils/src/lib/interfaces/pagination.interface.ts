import { FindOptionsWhere } from 'typeorm';

export interface IPaginationOptions<T> extends Partial<IRange> {
  page?: number;
  limit?: number;
  sortField?: string;
  sortOrder?: 'ASC' | 'DESC';
  filter?: string;
  where?: FindOptionsWhere<T>;
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

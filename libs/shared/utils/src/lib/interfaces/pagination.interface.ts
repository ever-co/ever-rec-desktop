export interface IPaginationOptions extends Partial<IRange> {
  page?: number;
  limit?: number;
  sortField?: string;
  sortOrder?: 'ASC' | 'DESC';
  filter?: string;
}

export interface IRange {
  start: Date | string | null;
  end: Date | string | null;
}
export interface IPaginationResponse<T> {
  data: T[];
  count: number;
  hasNext: boolean;
}
